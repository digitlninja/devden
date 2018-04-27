import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from 'constants';

// bring in express, we need it to wire up the routes
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const profileFactory = require('../../factories/profile-factory');
// @Route api/profile

router.get('/test', (req, res) => {
  res.json({ msg: 'Profile Works' });
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id }) // related user, nav property = ObjectId
    .then((profile) => {
      // if findOne runs, but no profile found
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';

        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err)); // if findOne FAILS
});

// @ Route api/profile / Create or Edit User
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const profileData = profileFactory(req.user, req.body);

  Profile.findOne({ user: req.user.id }).then((profile) => {
    // Update
    if (profile) {
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileData },
        { new: true }
      ).then((profile) => res.json(profile));
    } else {
      // Create
      Profile.findOne({ handle: profileData.handle }).then((profile) => {
        if (profile) {
          errors.handle = 'Oops, handle already exists.';
          res.status(400).json(errors);
        }
        // creates and saves
        const profile = new Profile(profileData);

        profile.save().then((profile) => res.json(profile));
      });
    }
  });
});

// export router for server.js
module.exports = router;

// profileData.user = req.user.id; // logged in user (includes avatar, name email??)
// if (req.body.handle) profileData.handle = req.body.handle;
// if (req.body.company) profileData.company = req.body.company;
// if (req.body.website) profileData.website = req.body.website;
// if (req.body.location) profileData.location = req.body.location;
// if (req.body.bio) profileData.bio = req.body.bio;
// if (req.body.githubusername) profileData.githubusername = req.body.githubusername;

// if (typeof req.body.skills !== 'undefined') {
//   profileData.skills = req.body.skills.split(','); // split comma sep, into array of skills
// }

// profileData.social = {};
// if (req.body.youtube) profileData.social.youtube = req.body.youtube;
// if (req.body.twitter) profileData.social.twitter = req.body.twitter;
// if (req.body.facebook) profileData.social.facebook = req.body.facebook;
// if (req.body.instagram) profileData.social.instagram = req.body.instagram;
