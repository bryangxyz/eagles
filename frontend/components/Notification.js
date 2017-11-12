import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class Notification extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      notifications: [
        {
          key: 1,
          user: 'demo',
          text: 'hello'
        },
        {
          key: 2,
          user: 'demo',
          text: 'what is up'
        }
      ],
      lessons: [],
      favoriteLessons: []
    };
  }

  componentDidMount() {
    var currentUser = window.localStorage.getItem('username');

    this.props.getLessons()
    .then((unfilteredLessons) => {
      return {
        lessons: unfilteredLessons.filter(lsn => this.props.user._id === lsn.userRef),
        favoriteLessons: unfilteredLessons.filter(lsn => lsn.userLikes.indexOf(this.props.user.username) >= 0)
      }
    })
    .then((lesson) => this.setState({lessons: lesson.lessons, favoriteLessons: lesson.favoriteLessons}))
    .then(() => {
      console.log('lessons', this.state.lessons);
      console.log('favoriteLessons', this.state.favoriteLessons);
      var notifications = [];
      for (var i = 0; i < this.state.lessons.length; i++) {
        var lesson = this.state.lessons[i];
        var lastComment = lesson.comments[lesson.comments.length - 1];
        if (lastComment.user != currentUser) {
          var notification = {
            lesson: lesson.name,
            user: lastComment.user,
            key: lastComment.key,
            lessonId: lesson._id
          }
          notifications.push(notification);
        }
      }
      for (var i = 0; i < this.state.favoriteLessons.length; i++) {
        var lesson = this.state.favoriteLessons[i];
        var lastComment = lesson.comments[lesson.comments.length - 1];
        if (lastComment.user != currentUser) {
          var notification = {
            lesson: lesson.name,
            user: lastComment.user,
            key: lastComment.key,
            lessonId: lesson._id
          }
          notifications.push(notification);
        }
      }
      this.setState({
        notifications: notifications
      });
      console.log('notifications', notifications);
    })
    .catch((err) => console.log('Error! ', err));
  }

  createNotifications(notification) {
    var day = moment(notification.key);
    var currentUser = window.localStorage.getItem('username');

    return (
      <li key={notification.key}>
        user <strong>{notification.user}</strong> commented on your lesson <strong>{notification.lesson}</strong> on <strong>{day._d.toString().slice(0,11)}</strong>
        {' '}<Link to={'/lesson/' + notification.lessonId}>
          <Button bsStyle="primary" bsSize="small">View Lesson</Button>
        </Link>
      </li>
    )
  }

  render() {
    var notificationEntries = this.state.notifications;
    var listNotifications = [].concat(notificationEntries).sort((a,b) => {
      return a.key - b.key
    }).reverse().map(this.createNotifications);

    return(
      <div>
        <h2>Notifications</h2>
        <ul className="theNotifications">
          {listNotifications}
        </ul>
      </div>
    )
  }
};

export default Notification;
