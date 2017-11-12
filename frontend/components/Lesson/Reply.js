import React, { Component } from 'react';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import ToggleDisplay from 'react-toggle-display';

class Reply extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      text: '',
      replies: this.props.replies
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleReplyChange = this.handleReplyChange.bind(this);
    this.addReply = this.addReply.bind(this);
    this.createReplies = this.createReplies.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
  }

  handleClick() {
    this.setState({
      show: !this.state.show
    });
  }

  handleReplyChange(e) {
    e.preventDefault();
    this.setState({
      text: e.target.value
    });
  }

  addReply(e) {
    e.preventDefault();
    var text = this.state.text.trim();
    var newReply= {
      text: text,
      key: Date.now()
    };

    //Save new reply to DB
    var body = { lessonid: this.props.lessonKey, commentid: this.props.commentKey, reply: newReply };
    fetch('/replies', {
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
        replies: data
      });
    })
    .catch(function(err) {
      console.log(err);
    });

    this.setState({
      text: ''
    });

  }

  deleteReply(key) {
    //Delete reply from DB
    var body = { lessonid: this.props.lessonKey, commentid: this.props.commentKey, replyid: key };
    fetch('/replies', {
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
        replies: data
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  }

  createReplies(reply) {
    var day = moment(reply.key);
    var currentUser = window.localStorage.getItem('username');

    return (
      <li key={reply.key}><h4>{reply.user}</h4>{day._d.toString()}
      <br/>
      {reply.text}
      &emsp;{currentUser === reply.user ?
              (<a href="#" onClick={(e) => {
                e.preventDefault();
                this.deleteReply(reply.key);
              }}>Delete</a>) : null
            }
      </li>
    )
  }

  render() {
    var replyEntries = this.state.replies;
    var listReplies = [].concat(replyEntries).sort((a,b) => {
      return a.key - b.key
    }).reverse().map(this.createReplies);

    var replyToggle;
    if (this.state.show === false) {
      replyToggle = 'Reply';
    } else {
      replyToggle = 'Hide Reply';
    }

    var replyCount;
    if (this.state.show === false) {
      replyCount = this.state.replies.length;
    } else {
      replyCount = '';
    }

    return(
      <div className="reply">
        <a href="#" onClick={ (e) => {
          e.preventDefault();
          this.handleClick(); }}>{replyToggle}</a> {replyCount}
        <ToggleDisplay show={this.state.show}>
          <form onSubmit={this.addReply}>
            <input
              className="replyInput"
              type="text"
              placeholder="Add a reply"
              value={this.state.text}
              onChange={this.handleReplyChange}
            />
            <Button className="replyPost" type="submit">post</Button>
          </form>
          <ul className="theReplies">
            {listReplies}
          </ul>
        </ToggleDisplay>
      </div>
    )
  }
};

export default Reply;
