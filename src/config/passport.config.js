import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import jwt from "passport-jwt";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
import { cartsModel } from "../dao/models/carts.model.js";
import { config } from "./config.js";

const extractToken = (req) => {
  return req.cookies.idToken || null;
};

export const initializePassport = () => {
  passport.use(
    "jwt",
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([extractToken]),
        secretOrKey: config.secretKey,
      },
      (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: config.githubCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let { name, email } = profile._json;
          let currentUser = await usersModel.findOne({ email: email });

          if (!currentUser) {
            let newUser = {
              name,
              email,
              github: true,
              githubProfile: profile._json,
            };
            currentUser = await usersModel.create(newUser);
          } else {
            let updateUser = {
              github: true,
              githubProfile: profile._json,
            };
            await usersModel.updateOne({ email: email }, updateUser);
          }

          let { firstName, lastName, age, role, cart } = currentUser;
          let user = {
            firstName,
            lastName,
            email,
            age,
            role,
            cart,
          };

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "logup",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { firstName, lastName, age } = req.body;
          if (!username || !password) return done(null, false);

          let currentUser = await usersModel.findOne({ email: username });
          if (currentUser) return done(null, false);

          let isAdmin = username === config.adminMail && password === config.adminPassword;
          let role = isAdmin ? "admin" : "user";
          let cart = await cartsModel.create({ alias: "" });
          let user = await usersModel.create({
            firstName,
            lastName,
            email: username,
            password: createHash(password),
            age,
            role,
            cart: cart._id,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (!username || !password) return done(null, false);

          let currentUser = await usersModel.findOne({
            email: username,
          });
          if (!currentUser || !isValidPassword(password, currentUser)) return done(null, false);

          let { firstName, lastName, email, age, role, cart } = currentUser;
          let user = {
            firstName,
            lastName,
            email,
            age,
            role,
            cart,
          };

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await usersModel.findOne({ _id: id });
    done(null, user);
  });
};
