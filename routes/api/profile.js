// bring in express, we need it to wire up the routes
const express = require('express');
const router = express.Router();

// uses route we set up in server.js, so only need the segment after /api/users / .json outputsjson

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: 'Profile Works' });
});

// export router for server.js
module.exports = router;
