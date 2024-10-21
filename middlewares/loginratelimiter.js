const RateLimit = require('express-rate-limit');

// Rate limiting middleware for login attempts
const loginRateLimiter = RateLimit({
  windowMs: 5 * 60 * 1000, // 5 minute
  max: 5, // Max 5 login attempts per minute
  handler: (req, res) => {
    res.status(400).json({ error: 'Too many login attempts, please try again after some time.' });
  },
});

module.exports = loginRateLimiter;

