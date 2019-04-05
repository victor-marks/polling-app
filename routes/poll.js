const express = require('express');
const router = express.Router();

const Pusher = require('pusher');

var pusher = new Pusher({
  appId: '753253',
  key: '6c2650c378f249adb331',
  secret: 'd4b918b7177a4b2d0a15',
  cluster: 'us3',
  encrypted: true
});

router.get('/', (req, res) => {
  res.send('POLL');
});

router.post('/', (req, res) => {
  pusher.trigger('os-poll', 'os-vote', {
    points: 1,
    os: req.body.os
  });

  return res.json({ success: true, message: 'Thanks for voting' });
});

module.exports = router;
