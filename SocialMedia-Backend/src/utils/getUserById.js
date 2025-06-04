import connectDB from "../database/connection.js";

const pool = connectDB();

const getUserById = async (id) => {
  const query = `SELECT id, username, firstName, lastName, email FROM users WHERE id = ?`;
  return await pool.query(query, [id]);
};

export default getUserById;
