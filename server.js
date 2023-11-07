const express = require('express');
const fs = require('fs');
const parsedNotes = require('./db/db.json');
const path = require('path');
const uuid = require('uuid');
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");


const app = express();
var PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Settings for APIs
// This code grabs notes saved and joins db.json
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"))
});

// Post function to add new notes to db.json
app.post("/api/notes", (req, res) => {
    const parsedNotes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    parsedNotes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(parsedNotes));
    res.json(parsedNotes);
});

//used for deleting notes
app.delete("/api/notes/:id", (req, res) => {
    const parsedNotes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNote = parsedNotes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.json(delNote);
});

//HTML calls
//calls home page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
//call for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//Start listen
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});