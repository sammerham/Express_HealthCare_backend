/** Database setup for doctors. */

const { Client } = require("pg");
const { DB_URI } = require("./config.js")

let db = new Client({
  connectionString: DB_URI
});

db.connect();

module.exports = db;