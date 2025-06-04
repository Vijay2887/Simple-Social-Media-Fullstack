import passport from "passport";
import { Strategy } from "passport-local";
import connectDB from "../database/connection.js";

const pool = connectDB();

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const [rows] = await pool.query(
        `SELECT * FROM USERS WHERE USERNAME = ? `,
        [username]
      );
      if (rows.length === 0) throw new Error("No such user with that username");
      if (rows[0].password !== password) throw new Error("Incorrect Password");
      done(null, rows[0]);
    } catch (error) {
      done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [findUser] = await pool.query(`SELECT * FROM USERS WHERE ID = ? `, [
      id,
    ]);
    if (findUser.length === 0)
      throw new Error("Cannot deserialize the user since no user found");
    done(null, findUser[0]);
  } catch (error) {
    done(error, null);
  }
});
