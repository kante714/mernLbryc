const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Access denied: admin only');
};

const subscriberOrAdmin = (req, res, next) => {
  if (req.user && ['admin', 'subscriber'].includes(req.user.role)) {
    return next();
  }
  res.status(403);
  throw new Error('Access denied: subscription required');
};

module.exports = { adminOnly, subscriberOrAdmin };
