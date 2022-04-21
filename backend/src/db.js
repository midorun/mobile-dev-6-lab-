const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const DBSOURCE = "src/db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    if (!fs.existsSync("src/db.sqlite")) {
      db.run(
        `CREATE TABLE tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text text,
            )`,
        (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Table just created, creating some rows");
            const insert = "INSERT INTO tags (value, label) VALUES (?,?)";
            db.run(insert, ["важно"]);
            db.run(insert, ["здоровье"]);
          }
        }
      );
    }
  }
});

// db.run(`DROP TABLE note_tag`);
// db.run(`DROP TABLE notes`);
// db.run(`DROP TABLE tags`);

// db.run(`
//   CREATE TABLE notes (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title text,
//     text text,
//     time text
//   )
// `);
//
// db.run(
//   `CREATE TABLE tags (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             text text
//             )`
// );
//
// db.run(`
//   CREATE TABLE note_tag (
//     noteId INTEGER,
//     tagId INTEGER
//   )
// `);

module.exports = db;
