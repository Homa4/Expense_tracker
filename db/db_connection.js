import mysql from "mysql2";
import { config } from "dotenv";

config();

const pool = mysql
  .createPool({
    host: "127.0.0.1",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: "Backend_lab2",
  })
  .promise();

try {
  const [user] = await pool.query("SELECT * FROM user");
  console.log("✅ Connected to db");
  console.log(user);
} catch (err) {
  console.error(err.message);
}
