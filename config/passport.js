const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const dbConfig = require("./database");

function initialise(passport) {
  const authenticateUser = async (username, password, done) => {
    try {
      const ps = dbConfig.getSelectUser();
      const user = await ps.get(username);
      // const db = await sqlite.open("./db.sqlite");
      // let user = await db.get(
      //   `select * from admin where username="${username}"`
      // );
      if (!user) {
        return done(null, false, { message: "No user with that username." });
      }

      if (await bcrypt.compare(password, user.passwordHash)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };
  passport.use(new LocalStrategy(authenticateUser));
  // Save the user id in our session
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  // Remove user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const ps = dbConfig.getDeserialiseUser();
      const user = await ps.get(id);
      // const db = await sqlite.open("./db.sqlite");
      // let user = db.get(`SELECT id, username FROM admin WHERE id="${id}"`);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = initialise;
