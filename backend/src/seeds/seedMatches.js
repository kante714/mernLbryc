// All dates relative to now so "upcoming" always means future
const now = new Date();
const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

const matches = [
  // ── MEN – RESULTS ──────────────────────────────────────────────
  {
    homeTeam: 'Burnley', awayTeam: 'AFC Bournemouth',
    homeScore: 0, awayScore: 0,
    date: daysAgo(11), venue: 'Turf Moor, Burnley',
    competition: 'Championship', status: 'result', team: 'men',
    matchReportSlug: 'match-report-burnley-0-0-afc-bournemouth',
  },
  {
    homeTeam: 'Leeds United', awayTeam: 'Burnley',
    homeScore: 2, awayScore: 1,
    date: daysAgo(14), venue: 'Elland Road, Leeds',
    competition: 'Championship', status: 'result', team: 'men',
  },
  {
    homeTeam: 'Burnley', awayTeam: 'Sunderland',
    homeScore: 2, awayScore: 0,
    date: daysAgo(17), venue: 'Turf Moor, Burnley',
    competition: 'Championship', status: 'result', team: 'men',
  },
  {
    homeTeam: 'Sheffield United', awayTeam: 'Burnley',
    homeScore: 1, awayScore: 1,
    date: daysAgo(21), venue: 'Bramall Lane, Sheffield',
    competition: 'Championship', status: 'result', team: 'men',
  },
  {
    homeTeam: 'Burnley', awayTeam: 'Stoke City',
    homeScore: 3, awayScore: 1,
    date: daysAgo(25), venue: 'Turf Moor, Burnley',
    competition: 'Championship', status: 'result', team: 'men',
  },
  {
    homeTeam: 'Coventry City', awayTeam: 'Burnley',
    homeScore: 0, awayScore: 2,
    date: daysAgo(28), venue: 'Coventry Building Society Arena',
    competition: 'Championship', status: 'result', team: 'men',
  },

  // ── MEN – UPCOMING ─────────────────────────────────────────────
  {
    homeTeam: 'Burnley', awayTeam: 'Norwich City',
    date: daysFromNow(4), venue: 'Turf Moor, Burnley',
    competition: 'Championship', status: 'upcoming', team: 'men',
    broadcastInfo: 'Sky Sports',
    ticketUrl: 'https://www.eticketing.co.uk/burnleyfc',
  },
  {
    homeTeam: 'Millwall', awayTeam: 'Burnley',
    date: daysFromNow(11), venue: 'The Den, London',
    competition: 'Championship', status: 'upcoming', team: 'men',
    broadcastInfo: 'Sky Sports',
  },
  {
    homeTeam: 'Burnley', awayTeam: 'Bristol City',
    date: daysFromNow(18), venue: 'Turf Moor, Burnley',
    competition: 'Championship', status: 'upcoming', team: 'men',
    ticketUrl: 'https://www.eticketing.co.uk/burnleyfc',
  },
  {
    homeTeam: 'Swansea City', awayTeam: 'Burnley',
    date: daysFromNow(25), venue: 'Swansea.com Stadium',
    competition: 'Championship', status: 'upcoming', team: 'men',
  },

  // ── WOMEN – RESULTS ────────────────────────────────────────────
  {
    homeTeam: "Burnley Women", awayTeam: "Wolverhampton Wanderers Women",
    homeScore: 1, awayScore: 0,
    date: daysAgo(10), venue: 'Turf Moor, Burnley',
    competition: "Women's Championship", status: 'result', team: 'women',
  },
  {
    homeTeam: "Leicester City Women", awayTeam: "Burnley Women",
    homeScore: 2, awayScore: 1,
    date: daysAgo(17), venue: 'King Power Stadium',
    competition: "Women's Championship", status: 'result', team: 'women',
  },

  // ── WOMEN – UPCOMING ───────────────────────────────────────────
  {
    homeTeam: "Burnley Women", awayTeam: "Sheffield United Women",
    date: daysFromNow(5), venue: 'Turf Moor, Burnley',
    competition: "Women's Championship", status: 'upcoming', team: 'women',
  },
  {
    homeTeam: "Charlton Athletic Women", awayTeam: "Burnley Women",
    date: daysFromNow(12), venue: 'The Valley, London',
    competition: "Women's Championship", status: 'upcoming', team: 'women',
  },

  // ── UNDER-21 ───────────────────────────────────────────────────
  {
    homeTeam: 'Burnley U21', awayTeam: 'Brighton & Hove Albion U21',
    homeScore: 0, awayScore: 2,
    date: daysAgo(9), venue: 'Turf Moor, Burnley',
    competition: 'PL2', status: 'result', team: 'under-21',
  },
  {
    homeTeam: 'Burnley U21', awayTeam: 'Preston North End U21',
    date: daysFromNow(6), venue: 'Barnfield Training Centre',
    competition: 'PL2', status: 'upcoming', team: 'under-21',
  },

  // ── UNDER-18 ───────────────────────────────────────────────────
  {
    homeTeam: 'Burnley U18', awayTeam: 'Blackburn Rovers U18',
    homeScore: 2, awayScore: 1,
    date: daysAgo(12), venue: 'Barnfield Training Centre',
    competition: 'U18 League', status: 'result', team: 'under-18',
  },
  {
    homeTeam: 'Burnley U18', awayTeam: 'Bolton Wanderers U18',
    date: daysFromNow(7), venue: 'Barnfield Training Centre',
    competition: 'U18 League', status: 'upcoming', team: 'under-18',
  },
];

module.exports = matches;
