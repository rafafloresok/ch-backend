import { Router } from "express";
import passport from "passport";
import { createToken, passportCall } from "../helpers/utils.js";

const router = Router();
export default router;

router.get("/current", passportCall("jwt"), (req, res) => {
  res.send(req.user);
});

router.get("/github", passportCall("github"), (req, res) => {});

router.get("/githubcallback", passportCall("github"), (req, res) => {
  let token = createToken(req.user);
  res.cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true }).redirect("/products");
});

router.post("/logup", passportCall("logup"), (req, res) => {
  res.redirect("/login");
});

router.post("/login", passportCall("login"), (req, res) => {
  let token = createToken(req.user);
  res.cookie("idToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true }).redirect("/products");
});

router.get("/logout", (req, res) => {
  res.clearCookie("idToken").redirect("/login");
});
