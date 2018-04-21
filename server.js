const express = require("express");

const app = express();

app.get("/", (req, res) => res.send("Hello World"));

// use environment port, or 5000 for local (as no env var set)
const port = process.env.PORT || 5000;

// listen on port, and handler for listening
app.listen(port, () => console.log(`Server running on port ${port}`));
