const express = require("express");
const mongoose = require("mongoose");

const app = express();

// DB Config
const db = require("./config/keys").prodDb;

// Connect to db
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World"));

// use environment port, or 5000 for local (as no env var set)
const port = process.env.PORT || 5000;

// listen on port, and handler for listening
app.listen(port, () => console.log(`Server running on port ${port}`));
