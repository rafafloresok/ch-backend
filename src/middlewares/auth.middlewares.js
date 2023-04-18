export const authUser = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.sendStatus(401);
    if (req.user.role == "admin") return next();
    if (req.user.role != role) return res.sendStatus(403);
    next()
  };
};
