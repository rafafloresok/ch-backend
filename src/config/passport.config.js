import passport from "passport";
import local from "passport-local";
import github from "passport-github2";
import { usersModel } from "../dao/models/users.model.js";
import { createHash, isValidPassword } from "../helpers/utils.js";

export const initializePassport = () => {
  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Iv1.882f2236b23fac24",
        clientSecret: "1b4bfb39b5480ecddcca5b643048bfbb124765be",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let { name, email } = profile._json;
          let user = await usersModel.findOne({ email: email });
  
          if (!user) {
            let newUser = {
              name,
              email,
              github: true,
              githubProfile: profile._json,
            }
            user = await usersModel.create(newUser);
          } else {
            let updateUser = {
              github: true,
              githubProfile: profile._json,
            };
            await usersModel.updateOne({email:email}, updateUser)
          }
  
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
