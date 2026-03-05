import pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg;
dotenv.config();

export default new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DB,
  password: process.env.DBPASSWORD,
  port: process.env.DBPORT,
});
