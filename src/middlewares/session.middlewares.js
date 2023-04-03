export const authHomeMid = (req, res, next) => {
  if (!req.session.user) return res.redirect("/login");
  next();
};

export const authLoginMid = (req, res, next) => {
  if (req.session.user) return res.redirect("/products");
  next();
};

