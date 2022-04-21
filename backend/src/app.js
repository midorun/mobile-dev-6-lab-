const express = require("express");
const db = require("./db.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
app.listen(PORT);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const baseUrl = "/api";

//Tags

const baseUrlUsers = baseUrl + "/users";
const baseUrlTagsId = `${baseUrlUsers}/:id`;

//GET ALL TAGS
app.get(baseUrlUsers, (req, res) => {
  const sql = "select * from tags";
  const params = [];

  // db.all(sql, params, (err, data) => {
  //   if (err) {
  //     res.status(400).json({error: err.message});
  //     return;
  //   }
  //   res.json({
  //     message: "success",
  //     data,
  //   });
  // });

  res.json({
    message: "success"
  })
});

// Get TAG BY ID
app.get(baseUrlTagsId, (req, res) => {
  const sql = "select * from tags where id = ?";
  const params = [req.params.id];

  db.all(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: "success",
      data,
    });
  });
});

// CREATE TAG
app.post(baseUrlUsers, (req, res, next) => {
  const {text} = req.body;
  console.log(req.body);

  const data = {
    text,
  };

  const sql = "INSERT INTO tags (text) VALUES (?)";
  const params = [text];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      message: "success",
      data,
      id: this.lastID,
    });
  });
});

//UPDATE TAG
app.put(baseUrlTagsId, (req, res, next) => {
  const {text} = req.body;
  console.log(req);

  const data = {
    text,
  };

  const sql = `
    UPDATE tags set 
    text = COALESCE(?,text)
    WHERE id = ?`;

  const params = [text, req.params.id];

  db.run(
    sql,
    params,

    function (err) {
      if (err) {
        res.status(400).json({error: res.message});
        return;
      }
      res.json({
        message: "success",
        data,
        changes: this.changes,
      });
    }
  );
});

//DELETE TAG
app.delete(baseUrlTagsId, (req, res, next) => {
  const sql = "DELETE FROM tags WHERE id = ?";
  const params = [req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({error: res.message});
      return;
    }
    res.json({message: "deleted", changes: this.changes});
  });
});

app.use((req, res) => {
  res.status(404);
  res.json({message: 'pong'})
});

module.exports = app;
