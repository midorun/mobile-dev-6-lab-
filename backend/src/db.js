const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const DBSOURCE = "src/db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    if (!fs.existsSync("src/db.sqlite")) {
      db.run(
        `CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            surname text,
            login text,
            password text,
            dateOfBirth text,
            photoUri text
            )`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }
});

module.exports = db;
