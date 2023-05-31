import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { usersService, tokensService } from "../dao/factory.js";
import { createFakePass, createHash, isValidPassword } from "../utils/utils.js";
import mailer from "../utils/mailer.utils.js";
import { BadRequestError, ForbiddenError, NotFoundError, ServerError, instanceOfCustomError } from "../utils/errors.utils.js";

class SessionsController {
  async getCurrent(req, res) {
    try {
      let result = await usersService.getCurrentById(req.user.id);
      if (result) {
        return res.status(200).send({ status: "success", result });
      } else {
        throw new ServerError("error trying to get current user data");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
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
      let token = createFakePass();
      let result =
        (await tokensService.updateResetToken(email, createHash(token))) || (await tokensService.addResetToken(email, createHash(token)));
      if (result) {
        mailer.sendPassResetLink(email, token);
        return res.status(201).send({ status: "success", result: "email sent" });
      } else {
        throw new ServerError("error trying to add reset token");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
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
        return res.status(200).send({ status: "success", result: "password reset success" });
      } else {
        throw new ServerError("error trying to reset password");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }

  async toggleRole(req, res) {
    try {
      let user = await usersService.getById(req.params.uid);
      if (req.user.role !== "admin") throw new ForbiddenError("must be admin user to change users roles");
      if (!user) throw new NotFoundError("user not found");
      if (user.role === "admin") throw new ForbiddenError("cannot change role of admin user");
      let newRole;
      if (user.role === "user") newRole = "premium";
      if (user.role === "premium") newRole = "user";
      let result = await usersService.updateById(req.params.uid, {role: newRole});
      if (result) {
        return res.status(200).send({ status: "success", result: "user role updated" });
      } else {
        throw new ServerError("error trying to update user role");
      }
    } catch (error) {
      return instanceOfCustomError(error)
        ? res.status(error.code).send({ status: "error", error: error.message })
        : res.status(500).send({ status: "error", error: "server error" });
    }
  }
}

const sessionsController = new SessionsController();
export default sessionsController;
