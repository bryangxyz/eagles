const express = require('express');
const schema = require('../db/schema.js');
const router = express.Router();
const mongoose = require('mongoose');
var User = schema.User;
var Lesson = schema.Lesson;
var Slide = schema.Slide;

//find specific user
router.get('/users/:userId', function(req, res) {
  User.find({_id: req.params.userId})
  .then(function(users) { 
    res.send(users);
  })
  .catch(function(err) {
    res.send(err);
  })
})

//find all users
router.get('/users', function(req, res) {
  User.find({})
  .then(function(users) { 
    res.send(users);
  })
  .catch(function(err) {
    res.send(err);
  })
})

router.put('/users', function(req, res) {
  User.findById(req.query._id, function(err, user) {
    if (err) res.send(err);

    if (req.body.username) user.username = req.body.username;
    if (req.body.lessons) user.lessons = req.body.lessons;
    if (req.body.favorites) user.favorites = req.body.favorites;
    if (req.body.createdLessons) user.createdLessons = req.body.createdLessons;

    User.save(function (err) {
      if (err) {
        throw err;
        return;
      };
      res.send('user updated')
    });
  });
});

router.delete('/users/:lessonId', function(req, res) {
  User.findByIdAndRemove(req.params.userId, function(err, user) {
    if (err) {
      throw err;
      return;
    };

    res.send(user._id + 'removed');
  });
});

module.exports = router;