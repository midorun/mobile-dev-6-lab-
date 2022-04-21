const express = require("express");
const db = require("./db.js");
const bodyParser = require("body-parser");
const cors = require("cors");
const { log } = require("util");

const app = express();
const PORT = 3000;
app.listen(PORT);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const baseUrl = "/api";

//Tags

const baseUrlTags = baseUrl + "/tags";
const baseUrlTagsId = `${baseUrlTags}/:id`;

//GET ALL TAGS
app.get(baseUrlTags, (req, res) => {
  const sql = "select * from tags";
  const params = [];

  db.all(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data,
    });
  });
});

// Get TAG BY ID
app.get(baseUrlTagsId, (req, res) => {
  const sql = "select * from tags where id = ?";
  const params = [req.params.id];

  db.all(sql, params, (err, data) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data,
    });
  });
});

// CREATE TAG
app.post(baseUrlTags, (req, res, next) => {
  const { text } = req.body;
  console.log(req.body);

  const data = {
    text,
  };

  const sql = "INSERT INTO tags (text) VALUES (?)";
  const params = [text];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
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
  const { text } = req.body;
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
        res.status(400).json({ error: res.message });
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
      res.status(400).json({ error: res.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

//Notes

const baseUrlNotes = baseUrl + "/notes";
const baseUrlNotesId = `${baseUrlNotes}/:id`;

const note_tag_insert_request = `INSERT INTO note_tag (noteId, tagId) VALUES (?,?)`;

//GET ALL NOTES
app.get(baseUrlNotes, (req, res) => {
  const notesPromise = new Promise((resolve, reject) => {
    db.all("select * from notes", [], function (err, data) {
      resolve(data);
    });
  });

  const tagsPromise = new Promise((resolve, reject) => {
    db.all("select * from tags", [], function (err, data) {
      resolve(data);
    });
  });

  const noteTagPromise = new Promise((resolve, reject) => {
    db.all("select * from note_tag", [], function (err, data) {
      resolve(data);
    });
  });

  Promise.all([notesPromise, tagsPromise, noteTagPromise]).then(
    ([notes, tags, noteTag]) => {
      const data = notes.map((note) => {
        if (!note.tags) note.tags = [];
        const { id } = note;
        const tagIds = [];

        noteTag.forEach(({ noteId, tagId }) => {
          if (noteId === id) {
            tagIds.push(tagId);
          }
        });
        tagIds.forEach((tagId) =>
          note.tags.push(tags.find((tag) => tag.id === tagId))
        );

        return note;
      });

      res.json({
        message: "success",
        data,
      });
    }
  );
});

//GET NOTE BY ID
app.get(baseUrlNotesId, (req, res) => {
  const id = req.params.id;
  const sql = "select * from notes where id = ?";
  const params = [id];

  const notesPromise = new Promise((resolve, reject) => {
    db.all("select * from notes where id = ?", [id], function (err, data) {
      resolve(data);
    });
  });

  const tagsPromise = new Promise((resolve, reject) => {
    db.all("select * from tags", [], function (err, data) {
      resolve(data);
    });
  });

  const noteTagPromise = new Promise((resolve, reject) => {
    db.all(
      "select * from note_tag where noteId = ?",
      [id],
      function (err, data) {
        resolve(data);
      }
    );
  });

  Promise.all([notesPromise, tagsPromise, noteTagPromise]).then(
    ([notes, tags, noteTag]) => {
      const data = notes.map((note) => {
        if (!note.tags) note.tags = [];
        const { id } = note;
        const tagIds = [];

        noteTag.forEach(({ noteId, tagId }) => {
          if (noteId === id) {
            tagIds.push(tagId);
          }
        });
        tagIds.forEach((tagId) =>
          note.tags.push(tags.find((tag) => tag.id === tagId))
        );

        return note;
      });

      res.json({
        message: "success",
        data,
      });
    }
  );
});

// CREATE NOTE
app.post(baseUrlNotes, (req, res, next) => {
  console.log(req.body)
  const { title, text, time, tagsIds } = req.body;
  const data = {
    title,
    text,
    time,
    tagsIds,
  };

  const sql = "INSERT INTO notes (title, text, time) VALUES (?,?,?)";
  const params = [title, text, time];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    const newNoteId = this.lastID;

    tagsIds.forEach((tagId) => {
      db.run(note_tag_insert_request, [this.lastID, tagId]);
    });

    res.json({
      message: "success",
      data,
      id: this.lastID,
    });
  });
});

//UPDATE NOTE
app.put(baseUrlNotesId, (req, res, next) => {
  console.log("put");
  const { title, text, time, tagsIds } = req.body;
  const noteId = req.params.id;
  const data = {
    title,
    text,
    time,
    tagsIds,
  };

  const sql = `
    UPDATE notes set 
    title = COALESCE(?,title), 
    text = COALESCE(?,text),
    time = COALESCE(?, time)
    WHERE id = ?`;

  const params = [title, text, time, noteId];

  db.run(
    sql,
    params,

    function (err) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }

      db.run(`DELETE FROM note_tag WHERE noteId = ?`, noteId);

      tagsIds.forEach((tagId) => {
        db.run(note_tag_insert_request, [noteId, tagId]);
      });

      res.json({
        message: "success",
        data,
        changes: this.changes,
      });
    }
  );
});

//DELETE NOTE
app.delete(baseUrlNotesId, (req, res, next) => {
  const sql = "DELETE FROM notes WHERE id = ?";
  const noteId = req.params.id;
  const params = [noteId];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(400).json({ error: res.message });
      return;
    }

    res.json({ message: "deleted", changes: this.changes });
  });
});

app.use((req, res) => {
  res.status(404);
});

module.exports = app;
