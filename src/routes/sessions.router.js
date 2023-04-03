import { Router } from "express";
import { usersModel } from "../dao/models/users.model.js";
import crypto from "crypto";

const router = Router();
export default router;

router.post("/logup", async (req, res) => {
  let { firstName, lastName, email, password, age } = req.body;
  let role;

  if (!email || !password) return res.sendStatus(400);

  let currentUser = await usersModel.findOne({ email: email });

  if (currentUser) return res.sendStatus(400);

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    role = "admin";
  } else {
    role = "user";
  }

  await usersModel.create({
    firstName,
    lastName,
    email,
    password: crypto.createHash("sha256", "secretKey").update(password).digest("base64"),
    age,
    role,
  });

  res.redirect("/login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  let user = await usersModel.findOne({
    email: email,
    password: crypto.createHash("sha256", "secretKey").update(password).digest("base64"),
  });

  if (!user) return res.sendStatus(401);

  req.session.user = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    age: user.age,
    role: user.role,
  };

  res.redirect("/products");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.redirect("/login");
    }
  });
});
