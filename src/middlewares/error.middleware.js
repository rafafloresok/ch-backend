export const errorMiddleware = (error, req, res, next) => {
  if (error) {
    console.log(error.message);
    res.setHeader("Content-Type", "application/json");
    return res.status(error.code).json({ error: `${error.message}. ${error.info}` });
  }
  next();
};
