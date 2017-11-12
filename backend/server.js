/*
Run server to persist data
routers in separate files
*/
const express = require('express');
const database = require('./db/database.js');
const path = require('path');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const session = require('express-session');

const schema = require('./db/schema.js');
var Lesson = schema.Lesson;

// create express instance
const app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);

// route handlers
const userRoutes = require('./routes/userRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const slideRoutes = require('./routes/slideRoutes');
const utilRoutes = require('./routes/utilRoutes');
const youtubeSearchRoutes = require('./routes/youtubeSearchRoutes');
const screenShotRoutes = require('./routes/screenShotRoutes');
const checkAuth = require('./checkAuth');


// morgan for logging and body parser to parse requests
app.use(morgan('tiny'));
app.use(bodyparser.json());

// set cookie for auth
app.use(session({
  secret: 'super secret',
  cookie: {
    maxAge: 6000000,
    secure: false,
    httpOnly: false
  }
}))


// public file with static routes
app.use(express.static(path.join(__dirname, '../frontend/public')));

app.get('/port', (req, res) => {
  var port = process.env.PORT || 3000;
  console.log('port', port);
  res.send("" + port);
})

// -------------------AUTH------------------------- //
app.get('/logout', checkAuth.logout);
app.post('/users', checkAuth.createAccount);
app.post('/login', checkAuth.attemptLoggin);
app.use(checkAuth.checkUser);
app.get('/currentUser', function(req, res) {
  var sessData = req.session;
  console.log('currentUser', sessData.username);
  res.send(sessData.username);
})
// ------------------------------------------------ //

// handle protected routes
app.all('/slides', slideRoutes);
app.all('/slides/*', slideRoutes);
app.all('/users', userRoutes);
app.all('/users/*', userRoutes);
app.all('/lessons', lessonRoutes);
app.all('/lessons/*', lessonRoutes);
app.all('/lesson', lessonRoutes);
app.all('/lesson/*', lessonRoutes);
app.all('/query', utilRoutes);
app.all('/youtube', youtubeSearchRoutes);
app.all('/comments', lessonRoutes);
app.all('/replies', lessonRoutes);
app.all('/screenshot', screenShotRoutes);

// redirect any uncaught routes
app.use((req, res) => {
	console.log('testing');
  res.redirect('/');
});

// server listens for requests
// app.listen(process.env.PORT || 3000);

io.sockets.on('connection', (client) => {
	client.on('newMessage', (data) => {
		console.log('newMessage recieved', data.lesson._id);

    Lesson.findOne({_id: data.lesson._id}, function(err, lesson) {
      var newMessage = {
        username: data.username,
        message: data.newMessage
      }
      lesson.chat.push(newMessage);
      console.log(lesson);
      lesson.save()
      client.broadcast.in('' + data.lesson._id).emit('updateChat', lesson)
      client.emit('updateChat', lesson)

    })
	})

  client.on('renderChat', (data) => {
    console.log('renderChat data', data.lesson)
    client.room = '' + data.lesson._id;
    client.join('' + data.lesson._id);
    Lesson.findOne({_id: data.lesson._id}, function(err, lesson) {
      client.emit('updateChat', lesson)
    })
  })
});

// io.listen(3001);
http.listen(process.env.PORT || 3000);