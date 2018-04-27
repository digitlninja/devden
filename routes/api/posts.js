// bring in express, we need it to wire up the routes
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ msg: 'Posts Works' });
});

// export router for server.js
module.exports = router;
