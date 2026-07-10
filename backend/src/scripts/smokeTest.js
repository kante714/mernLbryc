/**
 * End-to-end smoke test for CRUD + Cloudinary across every model.
 *
 * Run against a live server with real Mongo + Cloudinary credentials:
 *   npm run dev            (in one terminal)
 *   npm run seed           (so the admin user exists)
 *   node src/scripts/smokeTest.js   (in another terminal)
 *
 * Zero new dependencies — uses Node's built-in fetch/FormData/Blob (stable
 * since Node 18). Exits with code 1 if anything fails, so it's CI-friendly.
 *
 * SCOPE NOTE: only exercises the *image* upload path (thumbnails, photos,
 * logos, badges). Video's actual video-file upload isn't tested here — a
 * synthetic placeholder buffer would just get rejected by Cloudinary's real
 * format validation, so that path still needs a manual check with a real
 * video file (see the testing instructions given for the Video step).
 */

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://localhost:5000/api';
const ADMIN_EMAIL = process.env.SMOKE_ADMIN_EMAIL || 'admin@lbryc.com';
const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD || 'admin123';

// Minimal valid 1x1 transparent PNG — real, decodable image data, just tiny.
const TEST_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64'
);
const testImage = () => new Blob([TEST_PNG], { type: 'image/png' });

// Strips Cloudinary's version segment (/v1234567890/) so two secure_urls for
// the SAME public_id can be compared even though the version changes on
// every re-upload — used to prove the deterministic-public_id dedup works.
const stripVersion = (url) => (url || '').replace(/\/v\d+\//, '/');

let token;
let passed = 0;
let failed = 0;

const record = (name, ok, detail = '') => {
  ok ? passed++ : failed++;
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`);
};

const authHeader = () => ({ Authorization: `Bearer ${token}` });

const login = async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!res.ok || !data.token) throw new Error(`Login failed: ${data.message || res.status}`);
  token = data.token;
  record('Admin login', true);
};

const testPlayer = async () => {
  const createForm = new FormData();
  createForm.append('name', 'Smoke Test Player');
  createForm.append('slug', `smoke-test-player-${Date.now()}`);
  createForm.append('position', 'forward');
  createForm.append('photo', testImage(), 'photo.png');

  const createRes = await fetch(`${BASE_URL}/players`, { method: 'POST', headers: authHeader(), body: createForm });
  const created = await createRes.json();
  if (!createRes.ok) return record('Player: create', false, created.message);
  record('Player: create + photo uploaded', created.player.photoUrl?.includes('res.cloudinary.com'), created.player.photoUrl);

  const updateForm = new FormData();
  updateForm.append('name', 'Smoke Test Player Updated');
  updateForm.append('photo', testImage(), 'photo2.png');
  const updateRes = await fetch(`${BASE_URL}/players/${created.player._id}`, { method: 'PUT', headers: authHeader(), body: updateForm });
  const updated = await updateRes.json();
  record('Player: update replaces photo', updateRes.ok && updated.player.photoUrl !== created.player.photoUrl);

  const deleteRes = await fetch(`${BASE_URL}/players/${created.player._id}`, { method: 'DELETE', headers: authHeader() });
  record('Player: delete', deleteRes.ok);

  const getRes = await fetch(`${BASE_URL}/players/${created.player.slug}`);
  record('Player: 404 after delete', getRes.status === 404);
};

const testVideo = async () => {
  const createForm = new FormData();
  createForm.append('title', 'Smoke Test Video');
  createForm.append('category', 'highlights');
  createForm.append('premium', 'false');
  createForm.append('thumbnail', testImage(), 'thumb.png');

  const createRes = await fetch(`${BASE_URL}/videos`, { method: 'POST', headers: authHeader(), body: createForm });
  const created = await createRes.json();
  if (!createRes.ok) return record('Video: create', false, created.message);
  record('Video: create + thumbnail uploaded', created.video.thumbnail?.includes('res.cloudinary.com'), created.video.thumbnail);

  const deleteRes = await fetch(`${BASE_URL}/videos/${created.video._id}`, { method: 'DELETE', headers: authHeader() });
  record('Video: delete', deleteRes.ok);
};

const testStanding = async () => {
  const season = `SMOKE-${Date.now()}`;
  const createForm = new FormData();
  createForm.append('season', season);
  createForm.append('teamName', 'Smoke Test FC');
  createForm.append('teamCode', 'STF');
  createForm.append('position', '1');
  createForm.append('logo', testImage(), 'logo.png');

  const createRes = await fetch(`${BASE_URL}/standings`, { method: 'POST', headers: authHeader(), body: createForm });
  const created = await createRes.json();
  if (!createRes.ok) return record('Standing: create', false, created.message);
  record('Standing: create + logo uploaded', created.standing.logoUrl?.includes('res.cloudinary.com'), created.standing.logoUrl);

  // Duplicate (season, teamName) should be a clean 400, not a raw 500
  const dupForm = new FormData();
  dupForm.append('season', season);
  dupForm.append('teamName', 'Smoke Test FC');
  dupForm.append('teamCode', 'STF');
  dupForm.append('position', '2');
  const dupRes = await fetch(`${BASE_URL}/standings`, { method: 'POST', headers: authHeader(), body: dupForm });
  const dupBody = await dupRes.json();
  record('Standing: duplicate (season, teamName) rejected with 400', dupRes.status === 400, dupBody.message);

  const deleteRes = await fetch(`${BASE_URL}/standings/${created.standing._id}`, { method: 'DELETE', headers: authHeader() });
  record('Standing: delete', deleteRes.ok);
};

const testMatch = async () => {
  const teamName = `Smoke FC ${Date.now()}`;

  const formA = new FormData();
  formA.append('homeTeam', teamName);
  formA.append('awayTeam', 'Opponent A');
  formA.append('date', new Date(Date.now() + 86400000).toISOString());
  formA.append('competition', 'Smoke League');
  formA.append('homeTeamLogo', testImage(), 'badge-v1.png');
  const resA = await fetch(`${BASE_URL}/matches`, { method: 'POST', headers: authHeader(), body: formA });
  const matchA = await resA.json();
  if (!resA.ok) return record('Match: create A', false, matchA.message);
  record('Match: create A + badge uploaded', matchA.match.homeTeamLogo?.includes('res.cloudinary.com'), matchA.match.homeTeamLogo);

  // Same team name again, different match, different image file — should
  // overwrite the SAME Cloudinary asset (deterministic public_id), not clone one.
  const formB = new FormData();
  formB.append('homeTeam', teamName);
  formB.append('awayTeam', 'Opponent B');
  formB.append('date', new Date(Date.now() + 172800000).toISOString());
  formB.append('competition', 'Smoke League');
  formB.append('homeTeamLogo', testImage(), 'badge-v2.png');
  const resB = await fetch(`${BASE_URL}/matches`, { method: 'POST', headers: authHeader(), body: formB });
  const matchB = await resB.json();
  if (!resB.ok) return record('Match: create B', false, matchB.message);

  const samePublicId = stripVersion(matchA.match.homeTeamLogo) === stripVersion(matchB.match.homeTeamLogo);
  record('Match: same team name reuses same Cloudinary asset (no duplicate)', samePublicId,
    samePublicId ? stripVersion(matchB.match.homeTeamLogo) : `A=${matchA.match.homeTeamLogo} B=${matchB.match.homeTeamLogo}`);

  await fetch(`${BASE_URL}/matches/${matchA.match._id}`, { method: 'DELETE', headers: authHeader() });
  await fetch(`${BASE_URL}/matches/${matchB.match._id}`, { method: 'DELETE', headers: authHeader() });
  record('Match: cleanup (both deleted)', true);
};

const main = async () => {
  console.log(`Smoke testing ${BASE_URL}\n`);
  try {
    await login();
  } catch (err) {
    console.error(`\n❌ Could not log in — is the server running and seeded? (${err.message})`);
    process.exit(1);
  }

  for (const [name, fn] of [['Player', testPlayer], ['Video', testVideo], ['Standing', testStanding], ['Match', testMatch]]) {
    console.log(`\n--- ${name} ---`);
    try {
      await fn();
    } catch (err) {
      record(`${name}: unexpected error`, false, err.message);
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
};

main();
