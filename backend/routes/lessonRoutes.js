const express = require('express');
const nodemailer = require('nodemailer');
const schema = require('../db/schema.js');
const router = express.Router();
const mongoose = require('mongoose');
var User = schema.User;
var Lesson = schema.Lesson;
var Slide = schema.Slide;

const shouldEmail = (likes) => {
  return true;
  // let goal = 10;
  // while(goal <= likes) {
  //   goal *= 2;
  // }
  // if(goal === likes) return true;
  // return false;
}

const sendCongad = (userRef, lessonName, numLikes) => {
  // create reusable transporter object using the default SMTP transport
  User.find({ _id : userRef })
  .then((user) => {
    user = user[0];
    if (user.email) {
        console.log('sending email to ', user.email);
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
              user: "learningwithlessons@gmail.com",
              pass: "test123test"
            }
          });

        let mailOptions ={
            from: "Learning with Lessons", // sender address
            to: user.email, // list of receivers
            subject: "Congratulations!", // Subject line
            text: `Your lesson named ${lessonName} just reached ${numLikes} likes!`, // plaintext body
            html: `<p>Your lesson named ${lessonName} just reached ${numLikes} likes!<p>` // html body
        }

        smtpTransport.sendMail(mailOptions, function(error, response){
          if(error){
              console.log(error);
          }else{
              res.redirect('/');
          }
      });
    }
  })
  .catch((err) => {
    console.log('Error sending email: ', err);
  })
}

//find specific lesson
router.get('/lesson/:lessonId', function(req, res) {
  Lesson.find({_id: req.params.lessonId})
  .then(function(lesson) {
    return lesson[0];
  })
  .then((specificLesson) => {
    Slide.find({})
    .then((allSlides) => {
      specificLesson.slides = allSlides.filter((slide) => {
        if (specificLesson.slides.indexOf(slide._id) >= 0) {
          return slide;
        }
      });
      return specificLesson;
    })
    .then((lessonWithSlides) => {
      res.send(lessonWithSlides);
    })
  })
  .catch(function(err) {
    res.send(err);
  })
});

//find all lessons
router.get('/lessons', function(req, res) {
  Lesson.find({})
  .then(function(lessons) {
    console.log(lessons);
    res.send(lessons);
  })
  .catch(function(err) {
    res.send(err);
  })
});

router.post('/lessons', function(req, res) {
  var name = req.body.name;
  var userRef = req.body.userRef
  var description = req.body.description;
  var keywords = req.body.keywords;
  var slides = req.body.slides || [];
  Lesson.create({
    name: name,
    userRef: userRef,
    description: description,
    keywords: keywords,
    slides: slides ,
    likes: 0,
    userLikes: []
  })
  .then(function(result) {
    User.findById(userRef, function(err, user) {
      //console.log('err',err,'user',user);
      if (err) {
        throw err;
        return;
      } else {
        user.lessons.push(result._id);
        user.save();
      }
    })
    return result;
  })
  .then(result => {
    res.send(result);
  })
  .catch(function(err) {
    console.log('Error at endpoint /lessons type POST: ', err);
    res.send('Error');
  })
})

router.put('/lessons', function(req, res) {

  Lesson.findById(req.body.lessonid, function(err, lesson) {
    //console.log('lesson is ', lesson, 'err is ', err)
    // console.log('Lesson is ', Lesson, lesson.keyWords)
    if (err) res.send(err);

    if (req.body.name) lesson.name = req.body.name;
    if (req.body.userRef) lesson.userRef = req.body.userRef;
    if (req.body.description) lesson.description = req.body.description;
    if (req.body.slides) lesson.slides = req.body.slides;
    if (req.body.keyWords) lesson.keyWords = req.body.keyWords;
    if (req.body.fromLike === true) { // Therefore likes will not be added on put requests not from lesson.js
      if (lesson.userLikes.length !== 0) {
        if (lesson.userLikes.indexOf(req.session.username) === -1) {
          lesson.userLikes.push(req.session.username);
            console.log('lesson likes', lesson.likes);
          if (req.body.likes) lesson.likes = req.body.likes; // If they've liked it, good.
          if(shouldEmail(lesson.userLikes.length)) sendCongad(lesson.userRef, lesson.name, lesson.userLikes.length);
        }
      } else {
        lesson.userLikes.push(req.session.username);
        if (req.body.likes) lesson.likes = req.body.likes;
      }
    }
    // To remove a lesson from favorites list
    if (req.body.fromLike === false) {
      var index = lesson.userLikes.indexOf(req.session.username);
      lesson.userLikes.splice(index, 1);
      if (req.body.likes) lesson.likes = req.body.likes;
    }
    // Add comment to the lesson
    if (req.body.comment) {
      req.body.comment.user = req.session.username;
      lesson.comments.push(req.body.comment);
    }

    // // console.log('lesson.keyWords',lesson.keyWords, req.body.keyWords)
    lesson.save()
    .then(function (result) {
      res.send(result);
    })
    .catch(function(err) {
      console.log('line 271', err);
      throw err;
      return;
    })
  })
})

router.put('/comments', function(req, res) {
  Lesson.findById(req.body.lessonid, function(err, lesson) {
    if (err) res.send(err);

    // Add like to the comment
    if (req.body.commentid) {
      var likeCount;
      for (var i = 0; i < lesson.comments.length; i++) {
        if (req.body.commentid === lesson.comments[i].key) {
          likeCount = lesson.comments[i].likes + 1;
          break;
        }
      }
      Lesson.findOneAndUpdate({
          _id: req.body.lessonid,
          'comments.key': req.body.commentid
        },
        {
          $set: {
            'comments.$.likes': likeCount
          }
        },
        {new: true},
        function(err, doc) {
          console.log('found doc', doc);
          res.send(doc);
        }
      )
    }
  })
})

// Delete comment created by the user
router.delete('/comments', function(req, res) {
  Lesson.findById(req.body.lessonid, function(err, lesson) {
    if (err) res.send(err);
    // To remove a comment by the user who created it
    var index = lesson.comments.indexOf(req.body.commentid);
    lesson.comments.splice(index, 1);

    lesson.save()
    .then(function (result) {
      res.send(result);
    })
    .catch(function(err) {
      console.log('line 271', err);
      throw err;
      return;
    })
  })
})

router.put('/replies', function(req, res) {
  Lesson.findOne({
      _id: req.body.lessonid,
      'comments.key': req.body.commentid
    }, function(err, lesson) {
      if (err) res.send(err);

      var replyArr;

      for (var i = 0; i < lesson.comments.length; i++) {
        if (req.body.commentid === lesson.comments[i].key) {
          replyArr = lesson.comments[i].replies;
          break;
        }
      }

      var newReply = req.body.reply;
      newReply.user = req.session.username;
      replyArr.push(newReply);
      // Add reply to the comment
      Lesson.findOneAndUpdate({
          _id: req.body.lessonid,
          'comments.key': req.body.commentid
        },
        {
          $set: {
            'comments.$.replies': replyArr
          }
        },
        {new: true},
        function(err, doc) {
          for (var i = 0; i < doc.comments.length; i++) {
            if (req.body.commentid === doc.comments[i].key) {
              res.send(doc.comments[i].replies);
            }
          }
        }
      );
  })
})

router.delete('/replies', function(req, res) {
  Lesson.findOne({
      _id: req.body.lessonid,
      'comments.key': req.body.commentid
    }, function(err, lesson) {
      if (err) res.send(err);

      var replyArr;
      for (var i = 0; i < lesson.comments.length; i++) {
        if (req.body.commentid === lesson.comments[i].key) {
          replyArr = lesson.comments[i].replies;
          break;
        }
      }

      var index = replyArr.indexOf(req.body.replyid);
      replyArr.splice(index, 1);

      // Delete reply from comment
      Lesson.findOneAndUpdate({
          _id: req.body.lessonid,
          'comments.key': req.body.commentid
        },
        {
          $set: {
            'comments.$.replies': replyArr
          }
        },
        {new: true},
        function(err, doc) {
          for (var i = 0; i < doc.comments.length; i++) {
            if (req.body.commentid === doc.comments[i].key) {
              res.send(doc.comments[i].replies);
            }
          }
        }
      );
  })
})

router.delete('/lessons/:lessonId', function(req, res) {
  Lesson.findByIdAndRemove(req.params.lessonId, function(err, lesson) {
    if (err) {
      throw err;
      return;
    };

    res.send(lesson);
  });
});

router.post('/lessons/read', (req, res) => {
  console.log('lesson load', req.body);
  let lessonId = req.body.specificLesson._id;
  Lesson.findOne({_id: lessonId}, function(err, lesson) {
    if (!lesson.read) {
      lesson.read = 1;
    } else {
      lesson.read = lesson.read + 1;
    }
    console.log('new lesson', lesson);
    lesson.save();
  })
  res.send('a');
})

module.exports = router;
