/** Database setup for biztime. */
require("dotenv").config();
const { Client } = require("pg");

// 🔧 Comment out or delete the unused DB_URI logic for now
// let DB_URI;
// if (process.env.NODE_ENV === "test") {
//   DB_URI = "postgresql:///biztime_test";
// } else {
//   DB_URI = "postgresql:///biztime";
// }

const db = new Client({
  user: "lewis.stone",
  password: "R3dr0ver#897", // hardcoded here for testing
  host: "localhost",
  port: 5432,
  database: "biztime"
});

db.connect();

console.log("DB_PASSWORD from .env:", process.env.DB_PASSWORD); // optional for debug

module.exports = db;

