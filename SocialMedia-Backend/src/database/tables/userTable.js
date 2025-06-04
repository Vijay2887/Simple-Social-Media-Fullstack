import connectDB from "../connection.js";

const createUserTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    password VARCHAR(100),
    email VARCHAR(100) UNIQUE
);`;

  const pool = connectDB();
  try {
    // executing the query above
    await pool.query(query);
  } catch (err) {
    console.log(err.message);
  }
};

export default createUserTable;
