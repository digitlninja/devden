// bring in express, we need it to wire up the routes
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bunyan = require('bunyan');
const logger = bunyan.createLogger({ name: 'Devden' });

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const createProfile = require('../../factories/profile-factory');
const createExperience = require('../../factories/experience-factory');
const createEducation = require('../../factories/education-factory');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// @Route api/profile / Public

router.get('/test', (req, res) => {
  res.json({ msg: 'Profile Works' });
});

// @GET current users profile
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.user.id }) // related user, nav property = ObjectId
    .populate('user', ['name', 'email']) // populate related user data
    .then((profile) => {
      // if findOne runs, but no profile found
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';

        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(500).json(err)); // if findOne FAILS
});

router.get('/handle/:handle', (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'email', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'This user has no profile.';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => {
      logger.info(err);
      return res.status(500).json(err);
    });
});

router.get('/user/:userid', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.userid })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = 'This user has no profile.';
        return res.status(404).json(errors);
      }

      return res.status(200).json(profile);
    })
    .catch((err) => {
      logger.info(err);
      res.status(500).json({ profile: 'There is no profile for this user' });
    });
});

router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'email'])
    .then((profiles) => {
      if (!profiles) {
        return res.status(404).json('No profiles found');
      }
      return res.status(200).json(profiles);
    })
    .catch((err) => {
      logger.error(err);
      return res.status(500);
    });
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const model = createProfile(req.user, req.body);
  Profile.findOne({ user: req.user.id }).then((profile) => {
    // Update
    if (profile) {
      Profile.findOneAndUpdate({ user: req.user.id }, { $set: model }, { new: true })
        .then((profile) => res.json(profile))
        .catch((err) => res.json('Error Occured'));
    } else {
      // Create
      Profile.findOne({ handle: model.handle }).then((profile) => {
        if (profile) {
          errors.handle = 'Oops, handle already exists.';
          res.status(400).json(errors);
        }
        // creates and saves
        const entity = new Profile(model);

        entity.save().then((profile) => res.json(profile));
      });
    }
  });
});

router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const model = createExperience(req.body);
    console.log(model);
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          return res.status(404);
        }
        // logger.info(req);
        profile.experience.unshift(model);
        profile.save().then((profile) => {
          res.status(201).json(profile);
        });
      })
      .catch((err) => {
        logger.error(err);
        return res.status(500);
      });
  }
);

router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    console.log(req.body);
    const model = createEducation(req.body);
    console.log(model);
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile) {
          return res.status(404);
        }
        // logger.info(req);
        profile.education.unshift(model);
        profile.save().then((profile) => {
          res.status(201).json(profile);
        });
      })
      .catch((err) => {
        logger.error(err);
        return res.status(500);
      });
  }
);

router.delete(
  '/experience/:experience_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        profile.experience.remove({ _id: req.params.experience_id });
        profile.save();
      })
      .catch((err) => {
        logger.error(err);
        return res.status(500).json(err);
      });
  }
);

// export router for server.js
module.exports = router;
