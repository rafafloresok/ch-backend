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
      req.logger.debug("error trying to get current user data");
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
    //verifiy email in db
    req.logger.debug(req.body.email);
    let { email } = req.body;
    let user = await usersService.getByEmail(email);
    if (!user) return res.status(400).send({ status: "error", error: "user not found" });
    //add email and token to database (expires in 1h)
    let token = createFakePass();
    req.logger.debug(token);
    //if token exists rewrite it, else add it
    let result =
      (await tokensService.updateResetToken(email, createHash(token))) || (await tokensService.addResetToken(email, createHash(token)));
    if (result) {
      //send email with link
      await mailer.send(
        email,
        "Restablecer contraseña",
        `<p>
          Toca <a href="http://localhost:8080/passwordreset/${email}/${token}">aquí</a> para reestablecer tu contraseña.
        </p>`
      );
      return res.status(201).send({ status: "success", result: "email sent" });
    } else {
      return res.status(500).send({ status: "error", error: "error trying to add reset token" });
    }
  }

  async passwordResetEnd(req, res) {
    //verify email exists in tokens db
    let { email, token, newPassword } = req.body;
    let dbToken = await tokensService.getResetToken(email);
    if (!dbToken) return res.status(400).send({ status: "error", error: "user does not exist or link expired" });
    //verify token
    dbToken.password = dbToken.token;
    if (!isValidPassword(token, dbToken)) return res.status(400).send({ status: "error", error: "invalid reset token" });
    //verify new password is diferent from old password
    let user = await usersService.getByEmail(email);
    if (isValidPassword(newPassword, user)) return res.status(400).send({ status: "error", error: "new password must be different from old password" });
    //reset password in users db
    let update = { password: createHash(newPassword) };
    let result = await usersService.updateByEmail(email, update);
    if (result) {
      req.logger.debug("password reset success");
      return res.status(200).send({ status: "success", result: "password reset success" });
    } else {
      req.logger.debug("error trying to reset password");
      return res.status(500).send({ status: "error", error: "error trying to reset password" });
    }
  }
}

const sessionsController = new SessionsController();
export default sessionsController;
