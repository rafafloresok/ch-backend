import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { usersService, tokensService } from "../dao/factory.js";
import { createFakePass, createHash, isValidPassword } from "../utils/utils.js";
import mailer from "../utils/mailer.js";

class SessionsController {
  async getCurrent(req, res) {
    let result = await usersService.getCurrentById(req.user.id);
    if (result) {
      return res.status(200).send({ status: "success", result });
    } else {
      return res.status(500).send({ status: "error", error: "error trying to get current user data" });
    }
  }

  async github(req, res) {}

  async logup(req, res) {
    res.redirect("/login");
  }

  async login(req, res) {
    const createToken = (user) => {
      return jwt.sign({ user }, config.secretKey, { expiresIn: "24h" });
    };
    let token = createToken(req.user);
    let cookieOptions = { maxAge: 1000 * 60 * 60, httpOnly: true };
    res.cookie("idToken", token, cookieOptions).redirect("/products");
  }

  async logout(req, res) {
    res.clearCookie("idToken").redirect("/login");
  }

  async passwordResetInit(req, res) {
    let { email } = req.body;
    let user = await usersService.getByEmail(email);
    if (!user) return res.status(400).send({ status: "error", error: "user not found" });
    let token = createFakePass();
    let result =
      (await tokensService.updateResetToken(email, createHash(token))) || (await tokensService.addResetToken(email, createHash(token)));
    if (result) {
      mailer.sendPassResetLink(email, token);
      return res.status(201).send({ status: "success", result: "email sent" });
    } else {
      return res.status(500).send({ status: "error", error: "error trying to add reset token" });
    }
  }

  async passwordResetEnd(req, res) {
    let { email, token, newPassword } = req.body;
    let dbToken = await tokensService.getResetToken(email);
    if (!dbToken) return res.status(400).send({ status: "error", error: "link expired" });
    dbToken.password = dbToken.token;
    if (!isValidPassword(token, dbToken)) return res.status(400).send({ status: "error", error: "invalid token" });
    let user = await usersService.getByEmail(email);
    if (isValidPassword(newPassword, user))
      return res.status(400).send({ status: "error", error: "same password" });
    let update = { password: createHash(newPassword) };
    let result = await usersService.updateByEmail(email, update);
    if (result) {
      return res.status(200).send({ status: "success", result: "password reset success" });
    } else {
      return res.status(500).send({ status: "error", error: "error trying to reset password" });
    }
  }

  async toggleRole(req, res) {
    let user = await usersService.getById(req.params.uid);
    if (!user) return res.status(400).send({ status: "error", error: "user not found" });
    if (user.role === "admin") return res.status(400).send({ status: "error", error: "user is admin" });
    let result;
    if (user.role === "user") result = await usersService.updateById(req.params.uid, { role: "premium" });
    if (user.role === "premium") result = await usersService.updateById(req.params.uid, { role: "user" });
    if (result) {
      return res.status(200).send({ status: "success", result: "user role updated" });
    } else {
      return res.status(500).send({ status: "error", error: "error trying to update user role" });
    }
  }
}

const sessionsController = new SessionsController();
export default sessionsController;
