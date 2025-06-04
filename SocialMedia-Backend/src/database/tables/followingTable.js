import connectDB from "../connection.js";

const pool = connectDB();

const createFollowingTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS following(
        following_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        following INT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (following) REFERENCES users(id)
    );`;
  try {
    await pool.query(query);
  } catch (error) {
    console.log(error);
  }
};

export default createFollowingTable;
