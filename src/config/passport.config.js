import passport from "passport";
import local from "passport-local";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../helpers/utils.js";

export const initializePassport = () => {
  passport.use(
    "logup",
    new local.Strategy({ usernameField: "email", passReqToCallback: true }, async (req, username, password, done) => {
      try {
        let { firstName, lastName, age } = req.body;
        let role;

        if (!username || !password) return done(null, false);

        let currentUser = await usersModel.findOne({ email: username });

        if (currentUser) return done(null, false);

        if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
          role = "admin";
        } else {
          role = "user";
        }

        let user = await usersModel.create({
          firstName,
          lastName,
          email: username,
          password: createHash(password),
          age,
          role,
        });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    "login",
    new local.Strategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        if (!username || !password) return done(null, false);

        let user = await usersModel.findOne({
          email: username,
        });

        if (!user || !isValidPassword(password, user)) return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await usersModel.findOne({ _id: id });
    done(null, user);
  });
};
