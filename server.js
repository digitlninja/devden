const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Middleware

// Allow / Parse req body (false = can be string or array) & allow json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').prodDb;

// Connect to db
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World'));

// Use Routes (router) for these files / api controllers
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// use environment port, or 5000 for local (as no env var set)
const port = process.env.PORT || 5000;

// listen on port, and handler for listening
app.listen(port, () => console.log(`Server running on port ${port}`));
