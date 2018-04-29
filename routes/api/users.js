// bring in express, we need it to wire up the routes
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const keys = require('../../config/keys');
const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'Devden' });

const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validatLoginInput = require('../../validation/login');

// Uses route we set up in server.js, so only need the segment after /api/users / .json outputsjson

router.get('/test', (req, res) => {
  res.json({ msg: 'Users Works' });
});

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Create user
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
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

        // Create hashed password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                logger.info(`User ${newUser.name} created`);
                return res.status(201).json(user);
              })
              .catch((err) => {
                logger.info;
                throw err;
              });
          });
        });
      }
    })
    .catch((err) => {
      throw err;
    });

  // save to db
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validatLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) {
        errors.password = 'Incorrect password';
        res.status(400).json(errors);
      }
      // can put anything in, will be hashed in token creation with secret
      const payload = { id: user.id, name: user.name, avatar: user.avatar };
      jwt.sign(payload, keys.jwtPk, { expiresIn: 3600 }, (err, token) => {
        res.json({
          token: `Bearer ${token}`
        });
      });
    });
  });
});

// Use Jwt to handle the request / add it to the routes pipeline
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  // res.json({ req.user });
  res.send({ id: req.user.id, name: req.user.name, email: req.user.email });
});

// export router for server.js
module.exports = router;
