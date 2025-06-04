import connectDB from "../connection.js";

const pool = connectDB();

const createCommentTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS comments (
        comment_id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT,
        comment_message VARCHAR(100),
        comment_by INT,
        FOREIGN KEY (post_id) REFERENCES posts(post_id),
        FOREIGN KEY (comment_by) REFERENCES users(id)
    );`;
  try {
    await pool.query(query);
  } catch (error) {
    console.log(error.message);
  }
};

export default createCommentTable;
