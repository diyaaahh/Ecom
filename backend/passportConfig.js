const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value;

      try {
        let user = await pool.query("SELECT * FROM user_info WHERE email = $1", [email]);

        if (user.rows.length === 0) {
          user = await pool.query(
            "INSERT INTO user_info (email, name) VALUES ($1, $2) RETURNING *",
            [email, profile.displayName]
          );
        } else {
          user = user.rows[0];
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email, name: user.name },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
