const rateLimit = require('express-rate-limit');

// Baseline DoS protection across the whole API. Generous on purpose — this
// covers public read traffic (news, matches, players, etc.), so it should
// never bother a real visitor, only obvious abuse/scraping.
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

// Much stricter, scoped to /api/auth only. This is the one that actually
// matters for security: without it, login/register have no throttle at all,
// making credential stuffing and brute-force password guessing free.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

module.exports = { generalLimiter, authLimiter };
