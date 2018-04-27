const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const usersRouter = require('./routes/api/users');
const profileRouter = require('./routes/api/profile');
const postsRouter = require('./routes/api/posts');
const passport = require('passport');
const app = express();

// ---------------------
// @Middleware
// ---------------------

// Allow / Parse req body (false = can be string or array) & allow json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport config (passport stuff pulled in from here)
require('./config/passport')(passport);

// ---------------------
// @Database
// ---------------------

const db = require('./config/keys').prodDb;

// Connect
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// ---------------------
// @Router
// ---------------------

// Load the router for each controller which contains all its routes
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter);
app.use('/api/posts', postsRouter);

// use environment port, or 5000 for local (as no env var set)
const port = process.env.PORT || 5000;

// listen on port, and handler for listening
app.listen(port, () => console.log(`Server running on port ${port}`));
