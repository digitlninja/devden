// bring in express, we need it to wire up the routes
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../../models/Post');
const validatePostInput = require('../../validation/post');
const postFactory = require('../../factories/post-factory');

router.get('/test', (req, res) => {
  res.json({ msg: 'Posts Works' });
});

// @ Get all
router.get('/', (req, res) => {
  Post.find()
    .then((posts) => {
      if (!posts) {
        res.status(404).json('No posts found');
      }

      res.status(200).json(posts);
    })
    .catch((err) => {
      throw new Error();
    });
});

// @ Get by id
router.get('/:id', (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (!post) {
        res.status(404).json('Post not found');
      }

      res.status(200).json(post);
    })
    .catch((err) => {
      throw new Error();
    });
});

// @ Get by user
router.get('/user/:id', (req, res) => {
  Post.findOne({ user: req.params.id })
    .then((post) => {
      if (!post) {
        res.status(404).json('Post not found');
      }

      res.status(200).json(post);
    })
    .catch((err) => {
      throw new Error();
    });
});

// @ Create Posts
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  if (!isValid) {
    res.status(400).json(errors);
  }

  const model = postFactory(req.user, req.body);
  const entity = new Post(model);
  entity.save().then((post) => res.json(entity));
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id).then((post) => {
    if (!post) {
      res.status(404).json("Post doesn't exist");
    }
    Post.remove(post);
  });
});

// export router for server.js
module.exports = router;
