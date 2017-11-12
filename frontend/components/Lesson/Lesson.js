import React from 'react';
import LessonSlideListEntry from './LessonSlideListEntry.js';
import Slide from './Slide.js';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import Chat from './Chat.js';
// import Comments from './Comments.js';
import CommentEntries from './CommentEntries.js';
import axios from "axios";

import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Panel from 'react-bootstrap/lib/Panel';

class Lesson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      specificLesson: {
        chat: []
      },
      slides: [],
      currentSlide: null,
      index: 0,
      videoIdOfClickedOnVideo: '',
      liked: false,
      sortBy: 'Newest',
      commentRemoved: false
    }

    this.addComment = this.addComment.bind(this);
    this.likeAComment = this.likeAComment.bind(this);
    this.sendRead = this.sendRead.bind(this);
    this.onChangeSortBy = this.onChangeSortBy.bind(this);
    this.likeALesson = this.likeALesson.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  componentDidMount() {
    var currentUser = window.localStorage.getItem('username');
     fetch('/lesson/' + this.props.match.params.id, { method: 'GET', credentials: "include" })
      .then((response) => response.json())
      .then((lessonDataJSON) => {
        var likeStatus;
        if (lessonDataJSON.userLikes.indexOf(currentUser) != -1) {
          likeStatus = true;
        }
        this.setState({
          specificLesson: lessonDataJSON,
          slides: lessonDataJSON.slides,
          liked: likeStatus
        }, () => {
          this.sendRead();
        });
        console.log('specific lesson', this.state.specificLesson);
      })
  }

  sendRead() {
    var data = {
      specificLesson: this.state.specificLesson
    }
    axios.post('/lessons/read', data)
  }

  onLessonSlideListEntryClick(index) {

    var videoIdInUrl = this.state.slides[index].youTubeUrl;
    var sliceFrom = videoIdInUrl.indexOf('=');
    var videoId = videoIdInUrl.slice(sliceFrom + 1);
    this.setState({
      currentSlide: this.state.slides[index],
      index: index,
      videoIdOfClickedOnVideo: videoId
    });
  }

  exit() {
    this.setState({
      currentSlide: '',
      index: ''
    });
  }

  previousSlideClick(index) {
    index--;
    if (index < 0) {
      alert("There is no previous slide! You will be redirected to the Lesson Home Page.");
      this.exit();
    } else {
      this.setState({
        index: index
      });
      this.onLessonSlideListEntryClick(index);
    }
  }

  nextSlideClick(index) {
    index++;
    if (index === this.state.slides.length) {
      alert('You\'ve made it to the end of the lesson.')
      this.exit();
    } else {
      this.setState({
        index: index
      });
      this.onLessonSlideListEntryClick(index);
    }
  }

  renderVideo(thereIsAVideo) {
    if (thereIsAVideo) {
      return <iframe style={{width: 500, height: 350, float: "left"}} className="youtubeVideo" src={'https://www.youtube.com/embed/' + thereIsAVideo} allowFullScreen></iframe>
    }
  }

  likeALesson() {
    this.setState({
      liked: !this.state.liked,
    });

    if (this.state.liked === !true) {
      this.state.specificLesson.likes++;
    } else {
      this.state.specificLesson.likes--;
    }
    var body = { likes: this.state.specificLesson.likes, lessonid: this.state.specificLesson._id, fromLike: !this.state.liked };

    fetch('/lessons', {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    .then(function(result) {
      return result.json();
    })
    .then((likeCheck) => {
      if (this.state.liked === true) {
        alert("The lesson has been added to your favorites!");
      } else {
        alert("The lesson has been removed from your favorites!");
      }
      // if (this.state.specificLesson.likes - 1 === likeCheck.likes) {
      //   this.state.specificLesson.likes = likeCheck.likes;
      //   alert("You've already liked this lesson.");
      // } else {
      //   alert("You've liked this video and it has been added to your favorites!")
      //   console.log(this.state.specificLesson);
      // }
    })
    .catch(function(err) {
      console.log(err);
    })
  }

  addComment(e) {
    e.preventDefault();

    if (this._inputElement.value !== '') {
      var newComment = {
        text: this._inputElement.value,
        key: Date.now(),
        likes: 0,
        replies: []
      };

      //Save new comment to DB
      console.log('addComment', this.state.specificLesson);
      var body = { comment: newComment, lessonid: this.state.specificLesson._id };
      fetch('/lessons', {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      .then(function(result) {
        console.log('returned data', result);

        return result.json();
      })
      .then((data) => {
        this.setState({
          specificLesson: data
        });
      })
      .catch(function(err) {
        console.log(err);
      });

      this._inputElement.value = '';
    }

  }

  likeAComment(key) {
    var body = { lessonid: this.state.specificLesson._id, commentid: key };
    fetch('/comments', {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    .then(function(result) {
      return result.json();
    })
    .then((data) => {
      this.setState({
        specificLesson: data
      });
    })
    .catch(function(err) {
      console.log(err);
    });

  }

  deleteComment(key) {
    var body = { lessonid: this.state.specificLesson._id, commentid: key };
    fetch('/comments', {
      method: "DELETE",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
    .then(function(result) {
      return result.json();
    })
    .then((data) => {
      this.setState({
        specificLesson: data
      });
    })
    .catch(function(err) {
      console.log(err);
    });

  }

  onChangeSortBy(e) {
    this.setState({sortBy: e.target.value});
  }

  render() {
    const label = this.state.liked ? 'Unlike' : 'Like';
    return (
      <div>
        <div>
          <div className="lessonSlideList">
            <div className="lesson">
              <a className="twitter" href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-size="large" data-show-count="false">Tweet</a><script async src="//platform.twitter.com/widgets.js" charSet="utf-8"></script>
              <h1 className="lessonTitle">{this.state.specificLesson.name}</h1>
              <p className="lessonDescription">{this.state.specificLesson.description}</p>

              <Grid>
                <Row>
                {this.state.slides.map((slide, i) => (
                  <LessonSlideListEntry
                    slide={slide}
                    index={i}
                    key={i}
                    onLessonSlideListEntryClick={this.onLessonSlideListEntryClick.bind(this)}
                  />
                ))}
                </Row>
              </Grid>
            </div>
            { this.state.currentSlide ? (
          <Slide
          slideData={this.state.currentSlide}
          videoIdOfClickedOnVideo={this.state.videoIdOfClickedOnVideo}
          renderVideo={this.renderVideo(this.state.videoIdOfClickedOnVideo)}
          previousSlideClick={this.previousSlideClick.bind(this)}
          nextSlideClick={this.nextSlideClick.bind(this)}
          exitClick={this.exit.bind(this)}
          index={this.state.index}
          />
        ) : null }
            <Button type="button" onClick={this.likeALesson}>{label}</Button>
              <div className="commentsMain">
                <div className="header">
                  <form onSubmit={this.addComment}>
                    <input ref={(a) => this._inputElement = a} placeholder="Add a comment" />
                    <Button type="submit">post</Button>
                  </form>
                  <div>
                    SORT BY
                    <select value={this.state.sortBy} onChange={this.onChangeSortBy}>
                      <option value="Newest">Newest First</option>
                      <option value="Top">Top Comments</option>
                    </select>
                  </div>
                  <CommentEntries lesson={this.state.specificLesson} entries={this.state.specificLesson.comments || []}
                    onLike={this.likeAComment}
                    sortBy={this.state.sortBy}
                    onDelete={this.deleteComment}
                  />
                </div>
              </div>
          </div>
                <Chat lesson={this.state.specificLesson}/>
        </div>
        

      </div>
    );
  }
}


export default Lesson;
