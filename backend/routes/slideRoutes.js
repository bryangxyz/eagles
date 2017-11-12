const express = require('express');
const schema = require('../db/schema.js');
const router = express.Router();
const mongoose = require('mongoose');
var User = schema.User;
var Lesson = schema.Lesson;
var Slide = schema.Slide;

//find specific slide using params
router.get('/slides/:slideId', function(req, res) {
  Slide.find({_id: req.params.slideId})
  .then(function(slides) {
    res.send(slides);
  })
  .catch(function(err) {
    throw err;
    return;
  })
});


//find all slides
router.get('/slides', function(req, res) {
  Slide.find({})
  .then(function(slides) {
    res.send(slides);
  })
  .catch(function(err) {
    throw err;
    return;
  })
});

router.post('/slides', function(req, res) {
  var name = req.body.name;
  var lessonRef = req.body.lessonRef;
  var youTubeUrl = req.body.youTubeUrl;
  var text = req.body.text;
  var quizUrl = req.body.quizUrl;
  var youTubeThumbnailUrl = req.body.youTubeThumbnailUrl;
  var youTubeTags = req.body.youTubeTags;
  var annotations = req.body.annotations;
  var articleImage = req.body.articleImage;
  var articleUrl = req.body.articleUrl;
  Slide.create({ 
    name: name,
    lessonRef: lessonRef,
    youTubeUrl: youTubeUrl, 
    text: text, 
    quizUrl: quizUrl,
    youTubeThumbnailUrl: youTubeThumbnailUrl,
    youTubeTags: youTubeTags,
    annotations: annotations,
    articleImage: articleImage,
    articleUrl: articleUrl
    })
  .then(function(result) {
    Lesson.findById(lessonRef, function(err, lesson) {
      if (err) {
        throw err;
        return;
      } else {
        lesson.slides.push(result._id)
        lesson.save();
      }
    })
    return result;
  })
  .then(result => {
    res.send(result);
  })
  .catch(function(err) {
    res.send(err);
  });
});

router.put('/slides', function(req, res) {
  Slide.findById(req.body.id, function(err, slide) {
    if (err) res.send(err);

    if (req.body.name) slide.name = req.body.name;
    if (req.body.lessonRef) slide.lessonRef = req.body.lessonRef;
    if (req.body.youTubeUrl) slide.youTuleUrl = req.body.youTubeUrl;
    if (req.body.text) slide.text = req.body.text;
    if (req.body.quizUrl) slide.quizUrl = req.body.quizUrl;
    if (req.body.youTubeThumbnailUrl) slide.youTubeThumbnailUrl = req.body.youTubeThumbnailUrl;
    if (req.body.youTubeTags) slide.youTubeTags = req.body.youTubeTags;
    if (req.body.old) slide.old = true;

    console.log('slide being updated is ', slide);
    slide.save()
    .then(function (result) {
      res.send(result);
    })
    .catch(function (err) {
      console.log('line 293',err);
      throw err;
      return;
    });
  });
});

router.delete('/slides/:slideId', function(req, res) {
  Slide.findByIdAndRemove(req.params.slideId, function(err, slide) {
    if (err) {
      throw err;
      return;
    };

    res.send(slide._id + 'removed');
  });
});

module.exports = router;