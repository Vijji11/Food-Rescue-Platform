const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: `Forbidden: Only users with '${role}' role can perform this action`,
      });
    }

    next();
  };
};

module.exports = { requireRole };
