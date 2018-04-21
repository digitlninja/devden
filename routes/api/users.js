// bring in express, we need it to wire up the routes
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// uses route we set up in server.js, so only need the segment after /api/users / .json outputsjson

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Users Works' });
});

router.post('/register', (req, res) => {
  // create user
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        // get avatar by email or sample default
        s: '200',
        rating: 'pg',
        d: 'mm'
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.status(201).json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });

  // save to db
});

// @route   POST api/users/register
// @desc    Register user route
// @access  Public
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        res.status(200).json({ msg: 'Success' });
      } else {
        res.status(400).json({ password: 'Incorrect password' });
      }
    });
  });
});

// export router for server.js
module.exports = router;
