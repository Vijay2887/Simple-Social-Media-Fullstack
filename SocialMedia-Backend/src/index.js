import express from "express";
import connectDB from "./database/connection.js";
import initTables from "./database/initTables.js";
import getUserById from "./utils/getUserById.js";
import cors from "cors";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import passport from "./strategies/localStrategy.js";
import isAuthenticated from "./middlewares/isAuthenticated.js";

// database connection
const pool = connectDB();

const app = express();

const sessionStore = new (MySQLStore(session))(
  {
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "node_mysql_ts",
  },
  pool
);

// setting up some middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    key: "myapp.sid",
    secret: "session-secret",
    saveUninitialized: false,
    resave: false,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //1 day
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// initialize the tables
await initTables();

// testing route
app.get("/", (req, res) => {
  return res.status(200).send("Hello world");
});

// route to register a user
app.post("/register", async (req, res) => {
  const { body } = req;
  const query = `INSERT INTO users (username, firstName, lastName, password, email) VALUES (?, ?, ?, ?, ?)`;
  try {
    const [result] = await pool.query(query, [
      body.username,
      body.firstName,
      body.lastName,
      body.password,
      body.email,
    ]);
    if (result.affectedRows === 1) {
      const [user] = await getUserById(result.insertId);
      return res
        .status(200)
        .send({ msg: "Inserted successfully", user: user[0], result });
    } else throw new Error("Error while inserting the user");
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "erro in /register route", error: error.message });
  }
});

// route to check if the user is authenticated or not
app.get("/auth-check", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// route to login a user
app.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.user) {
    return res.status(200).send({ msg: "You are logged in", user: req.user });
  } else {
    return res.status(400).send({ msg: "Please login first" });
  }
});

app.use(isAuthenticated);

// route to return or get the current login user
app.get("/user", async (req, res) => {
  const {
    user: { password, ...rest },
  } = req;
  const query = `select f.following from following f where f.user_id = ? `;
  const [queryResult] = await pool.query(query, rest.id);
  const followingUserIdArr = [];
  queryResult.forEach((q) => {
    followingUserIdArr.push(q.following);
  });
  rest.followingIds = followingUserIdArr;
  res.status(200).send(rest);
});

// route to get a user
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await getUserById(id);
    return res.status(200).send(result[0]);
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "error in /users/:id route", error: error.message });
  }
});

// route to add a new post
app.post("/post", async (req, res) => {
  const { body, user } = req;
  try {
    const query = `INSERT INTO POSTS (title, description, created_by, created_on) VALUES (?,?,?,?)`;
    const [result] = await pool.query(query, [
      body.title,
      body.description,
      user.id,
      new Date(Date.now()),
    ]);
    if (result.affectedRows === 1) {
      return res.status(200).send({ msg: "Post successfully added" });
    } else {
      throw new Error();
    }
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "error in /post route", error: error.message });
  }
});

// route to get all posts
app.get("/post", async (req, res) => {
  const query = `SELECT p.*, u.* FROM posts AS p
  JOIN users AS u ON p.created_by = u.id`;
  try {
    const [result] = await pool.query(query);
    const modifiedResults = result.map((r) => {
      const {
        password,
        post_id,
        title,
        description,
        created_by,
        created_on,
        ...userDetails
      } = r;
      return {
        post_id,
        title,
        description,
        created_by,
        created_on,
        userDetails,
      };
    });
    const [commentsResult] = await pool.query(
      `select c.*, u.username from comments c join users u on c.comment_by = u.id;`
    );
    // convert the comments to dictionaries/hash map for easy lookup based on post_id
    let commentsDic = {};
    commentsResult.forEach((ele) => {
      if (!commentsDic[ele.post_id]) {
        commentsDic[ele.post_id] = [
          {
            comment: ele.comment_message,
            "commented By": ele.username,
          },
        ];
      } else {
        commentsDic[ele.post_id].push({
          comment: ele.comment_message,
          "commented By": ele.username,
        });
      }
    });
    // add comments dynamically
    modifiedResults.forEach((mr) => {
      if (commentsDic[mr.post_id]) {
        mr.comments = commentsDic[mr.post_id];
      } else {
        mr.comments = [];
      }
    });

    const { user } = req;
    const userFollowingsQuery = `SELECT f.following FROM following as f WHERE f.user_id = ${user.id}`;
    const [userFollowings] = await pool.query(userFollowingsQuery);
    const userFollowingIds = userFollowings.map((u) => {
      return u.following;
    });

    modifiedResults.map((m) => {
      const isFollowing = userFollowingIds.includes(m.created_by);
      m.isFollowing = isFollowing;
    });

    return res.status(200).send({ msg: "All Posts", modifiedResults });
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "Error in get /post route", error: error.message });
  }
});

// route to unfollow a user
app.post("/unfollow", async (req, res) => {
  const {
    user,
    body: { postBy }, //postBy contains the id of the creator of that post
  } = req;
  const followingIdArr = [];
  const query = `select f.* from following f join users u on u.id = f.user_id where f.user_id = ?`;
  try {
    const [response] = await pool.query(query, [user.id]);
    response.forEach((r) => {
      followingIdArr.push(r.following);
    });
    if (!followingIdArr.includes(postBy)) {
      throw new Error("You cannot unfollow a user you are not following");
    }

    // deleteing that record from following table so as to unfollow
    const unfollowQuery = `delete from following f where f.user_id = ? and f.following = ?`;
    const [unfollowQueryResponse] = await pool.query(unfollowQuery, [
      user.id,
      postBy,
    ]);

    return res.status(200).send(unfollowQueryResponse);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// route to get post count
app.get("/post-count", async (req, res) => {
  const query = `SELECT COUNT(p.post_id) AS no_of_posts, p.created_by, u.* FROM posts AS p 
  JOIN users AS u on p.created_by = u.id
  GROUP BY p.created_by`;
  try {
    const [result] = await pool.query(query);
    const modifiedResults = result.map((r) => {
      const { no_of_posts, created_by, password, ...rest } = r;
      return { no_of_posts, created_by, userDetails: rest };
    });
    return res.status(200).send({ msg: "Post Count", modifiedResults });
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "Error in /post-count route", error: error.message });
  }
});

// route to add a comment
app.post("/comment", async (req, res) => {
  const { body, user } = req;
  const query = `INSERT INTO comments(post_id, comment_message, comment_by) VALUES (?,?,?)`;
  try {
    await pool.query(query, [body.postId, body.msg, user.id]);
    return res.status(200).send({ msg: "comment added successfully" });
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "Error in /comment route", error: error.message });
  }
});

// route to follow a user
app.post("/follow", async (req, res) => {
  const { body, user } = req;
  const query = `INSERT INTO following(user_id, following) VALUES (?,?)`;
  try {
    if (body.id === user.id) throw new Error("You cannot follow yourself");
    await pool.query(query, [user.id, body.id]);
    return res.status(200).send({ msg: `You are now following ${body.id}` });
  } catch (error) {
    return res
      .status(400)
      .send({ msg: "Error in /follow route", error: error.message });
  }
});

// route to get all followings of eahc user
app.get("/followings", async (req, res) => {
  const query = `SELECT f.user_id,u.username,u.email,f.following, us.username as fol_username, us.email as fol_email from following as f 
  JOIN users as u ON u.id = f.user_id 
  JOIN users as us ON f.following = us.id
  GROUP BY f.user_id, f.following, u.username, u.email, us.username, us.email`;
  const [result] = await pool.query(query);
  const modifiedResults = result.map((r) => {
    return {
      user_id: r.user_id,
      userDetails: { username: r.username, email: r.email },
      followingUserId: r.following,
      followingUserDetails: { username: r.fol_username, email: r.fol_email },
    };
  });
  const formattedDic = {};
  modifiedResults.forEach((ele) => {
    if (!formattedDic[ele.user_id]) {
      formattedDic[ele.user_id] = {
        user_id: ele.user_id,
        userDetails: ele.userDetails,
        followings: [],
      };
    }
    formattedDic[ele.user_id].followings.push({
      id: ele.followingUserId,
      ...ele.followingUserDetails,
    });
  });
  const formattedOutput = Object.values(formattedDic);

  return res.status(200).send(formattedOutput);
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
