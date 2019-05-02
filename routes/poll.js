const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

var pusher = new Pusher({
  appId: '753253',
  key: '6c2650c378f249adb331',
  secret: 'd4b918b7177a4b2d0a15',
  cluster: 'us3',
  encrypted: true
});

router.get('/', (req, res) => {
  Vote.find().then(votes => res.json({ success: true, votes }));
});

router.post('/', (req, res) => {
  const newVote = {
    os: req.body.os,
    points: 1
  };

  new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points: +vote.points,
      os: vote.os
    });

    return res.json({ success: true, message: 'Thanks for voting' });
  });
});

module.exports = router;
