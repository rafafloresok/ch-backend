import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { usersService, tokensService } from "../dao/factory.js";
import { createPassword, createHash, isValidPassword } from "../utils/utils.js";
import mailer from "../utils/mailer.utils.js";
import { BadRequestError, ForbiddenError, NotFoundError, ServerError, instanceOfCustomError } from "../utils/errors.utils.js";

class SessionsController {
  async getCurrent(req, res) {
    res.status(200).json(req.user);
  }

  async github(req, res) {}

  async logup(req, res) {
    res.redirect("/login");
  }

  async login(req, res) {
    let token = jwt.sign({ user: req.user }, config.secretKey, { expiresIn: "24h" });
    let cookieOptions = { maxAge: 1000 * 60 * 60, httpOnly: true };
    res.cookie("idToken", token, cookieOptions).redirect("/products");
  }

  async logout(req, res) {
    res.clearCookie("idToken").redirect("/login");
  }

  async passwordResetInit(req, res) {
    try {
      let { email } = req.body;
      let user = await usersService.getByEmail(email);
      if (!user) throw new NotFoundError("user not found");
      let token = createPassword();
      let result =
        (await tokensService.updateResetToken(email, createHash(token))) || (await tokensService.addResetToken(email, createHash(token)));
      if (result) {
        mailer.sendPassResetLink(email, token);
        return res.status(201).json({ status: "success", result: "email sent" });
      } else {
        throw new ServerError("error trying to add reset token");
      }
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).json({ status: "error", error: error.message });
      return res.status(500).json({ status: "error", error: "server error" });
    }
  }

  async passwordResetEnd(req, res) {
    try {
      let { email, token, newPassword } = req.body;
      let dbToken = await tokensService.getResetToken(email);
      if (!dbToken) throw new NotFoundError("link expired");
      dbToken.password = dbToken.token;
      if (!isValidPassword(token, dbToken)) throw new BadRequestError("invalid token");
      let user = await usersService.getByEmail(email);
      if (isValidPassword(newPassword, user)) throw new BadRequestError("same password");
      let update = { password: createHash(newPassword) };
      let result = await usersService.updateByEmail(email, update);
      if (result) {
        return res.status(200).json({ status: "success", result: "password reset success" });
      } else {
        throw new ServerError("error trying to reset password");
      }
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).json({ status: "error", error: error.message });
      return res.status(500).json({ status: "error", error: "server error" });
    }
  }

  async toggleRole(req, res) {
    try {
      let user = await usersService.getById(req.params.uid);
      if (!user) throw new NotFoundError("user not found");
      if (user.role === "admin") throw new ForbiddenError("cannot change role of admin user");
      let newRole;
      if (user.role === "user") newRole = "premium";
      if (user.role === "premium") newRole = "user";
      let result = await usersService.updateById(req.params.uid, { role: newRole });
      if (result) {
        return res.status(200).json({ status: "success", result: "user role updated" });
      } else {
        throw new ServerError("error trying to update user role");
      }
    } catch (error) {
      if (instanceOfCustomError(error)) return res.status(error.code).json({ status: "error", error: error.message });
      return res.status(500).json({ status: "error", error: "server error" });
    }
  }
}

const sessionsController = new SessionsController();
export default sessionsController;
