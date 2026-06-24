// All dates relative to now so "upcoming" always means future
const now = new Date();
const daysFromNow = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

const matches = [
  // ── MEN – RESULTS ──────────────────────────────────────────────
   {
    homeTeam: 'Likhu Bhujee RYC', awayTeam: 'Humla FA',
    homeScore: 6, awayScore: 1,
    date: daysAgo(25), venue: 'Anfa Complex, Kathmandu',
    competition: 'C division qualifier', status: 'result', team: 'men',
  },
  {
    homeTeam: 'We Are Brothers', awayTeam: 'Likhu Bhujee RYC',
    homeScore: 2, awayScore: 2,
    date: daysAgo(21), venue: 'Anfa Complex, Kathmandu',
    competition: 'C division qualifier', status: 'result', team: 'men',
  },
  {
    homeTeam: 'Likhu Bhujee RYC', awayTeam: 'Bhamti Bhandar',
    homeScore: 1, awayScore: 0,
    date: daysAgo(11), venue: 'Amrit Gamchaya, Bhujee',
    competition: 'Bhujee League', status: 'result', team: 'men',
    matchReportSlug: 'match-report-likhu-bhujee-1-0-bhamti-bhandar',
  },
  {
    homeTeam: 'Bigu', awayTeam: 'Likhu Bhujee RYC',
    homeScore: 0, awayScore: 0,
    date: daysAgo(14), venue: 'Amrit Gamchaya, Bhujee',
    competition: 'Bhujee League', status: 'result', team: 'men',
  },
  {
    homeTeam: 'Likhu Bhujee RYC', awayTeam: 'United Rasnalu',
    homeScore: 2, awayScore: 0,
    date: daysAgo(17), venue: 'Amrit Gamchaya, Bhujee',
    competition: 'Bhujee League', status: 'result', team: 'men',
  },

  // ── MEN – UPCOMING ─────────────────────────────────────────────
  {
    homeTeam: 'Likhu Bhujee RYC', awayTeam: 'TBD',
    date: daysFromNow(4), venue: 'TBD',
    competition: 'TBD', status: 'upcoming', team: 'men',
    broadcastInfo: 'Deepak4able',
    ticketUrl: '#',
  },
  {
    homeTeam: 'TBD', awayTeam: 'Likhu Bhujee RYC',
    date: daysFromNow(11), venue: 'TBD',
    competition: 'TBD', status: 'upcoming', team: 'men',
    broadcastInfo: 'Deepak4able',
  },
  {
    homeTeam: 'Likhu Bhujee RYC', awayTeam: 'TBD',
    date: daysFromNow(18), venue: 'TBD',
    competition: 'TBD', status: 'upcoming', team: 'men',
    ticketUrl: '#',
  },
  {
    homeTeam: 'Likhu Bhujee RYC', awayTeam: 'TBD',
    date: daysFromNow(25), venue: 'TBD',
    competition: 'TBD', status: 'upcoming', team: 'men',
  },

  // ── WOMEN – RESULTS ────────────────────────────────────────────
  {
    homeTeam: "Likhu Bhujee RYC", awayTeam: "We Are Brothers Women",
    homeScore: 1, awayScore: 0,
    date: daysAgo(10), venue: 'Amrit Gamchaya, Bhujee',
    competition: "Women's Championship", status: 'result', team: 'women',
  },
  {
    homeTeam: "Okhaldunga Women", awayTeam: "Likhu Bhujee RYC",
    homeScore: 2, awayScore: 1,
    date: daysAgo(17), venue: 'Okhaldunga Stadium, Okhaldunga',
    competition: "Women's Championship", status: 'result', team: 'women',
  },

  // ── WOMEN – UPCOMING ───────────────────────────────────────────
  {
    homeTeam: "Likhu Bhujee RYC", awayTeam: "TBD",
    date: daysFromNow(5), venue: 'TBD',
    competition: "TBD", status: 'upcoming', team: 'women',
  },
  {
    homeTeam: "TBD", awayTeam: "Likhu Bhujee RYC",
    date: daysFromNow(12), venue: 'TBD',
    competition: "TBD", status: 'upcoming', team: 'women',
  },

  // ── UNDER-21 ───────────────────────────────────────────────────
  {
    homeTeam: 'Likhu Bhujee RYC U21', awayTeam: 'Bhamti Bhandar U21',
    homeScore: 0, awayScore: 0,
    date: daysAgo(9), venue: 'Army Ground, Kathmandu',
    competition: 'Friendly', status: 'result', team: 'under-21',
  },
  {
    homeTeam: 'Likhu Bhujee RYC U21', awayTeam: 'We Are Brothers U21',
    date: daysFromNow(6), venue: 'NSF Ground, Kathmandu',
    competition: 'Friendly', status: 'upcoming', team: 'under-21',
  },

  // ── UNDER-18 ───────────────────────────────────────────────────
  {
    homeTeam: 'Likhu Bhujee RYC U18', awayTeam: 'Bhamti Bhandar U18',
    homeScore: 2, awayScore: 1,
    date: daysAgo(12), venue: 'NSF Ground, Kathmandu',
    competition: 'U18 League', status: 'result', team: 'under-18',
  },
  {
    homeTeam: 'Likhu Bhujee RYC U18', awayTeam: 'We Are Brothers U18',
    date: daysFromNow(7), venue: 'NSF Ground, Kathmandu',
    competition: 'U18 League', status: 'upcoming', team: 'under-18',
  },
];

module.exports = matches;
