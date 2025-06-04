import mysql from "mysql2/promise";

export default function connectDB() {
  return mysql.createPool({
    host: "localhost",
    user: "root",
    password: "mysql",
    database: "node_mysql_ts",
    waitForConnections: true,
    // connectionLimit: 10,
  });
}
