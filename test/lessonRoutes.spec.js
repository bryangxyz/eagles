import {expect} from 'chai';
var userRoutes = require('../backend/routes/lessonRoutes.js');
const schema = require('../backend/db/schema.js');
var Lesson = schema.Lesson;

function returnA(body) {
  let lessonId = body;
  console.log('testing');
  Lesson.findOne({_id: lessonId}, function(err, lesson) {
    console.log('testing two')
    if (!lesson.read) {
      lesson.read = 1;
    } else {
      lesson.read = lesson.read + 1;
    }
    console.log('new lesson', lesson);
    lesson.save(function(err) {
      if (err) console.log(err)
    });
  })
  return 'a'
}

describe('lesson routes', function() {
  describe('lesson read', function() {
    it('increment index', function() {
      expect(returnA({
        "$oid": "59d5198e7b65e9c996911389"
    })).to.eql('a');
    });
  });
});
