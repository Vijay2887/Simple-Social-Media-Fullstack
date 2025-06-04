import connectDB from "../connection.js";

const pool = connectDB();

const createPostTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS POSTS (
        post_id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100),
        description VARCHAR(100),
        created_by INT,
        created_on DATE,
        FOREIGN KEY (created_by) REFERENCES users(id)
    );`;
  try {
    await pool.query(query);
  } catch (error) {
    console.log(error);
  }
};

export default createPostTable;
