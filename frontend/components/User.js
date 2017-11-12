import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import c3 from 'c3';
import { ListGroupItem, Header, Button } from 'react-bootstrap';
import { ListGroup, DropdownButton, ButtonGroup, MenuItem } from 'react-bootstrap';
import LessonPreviewContainer from './Lesson/LessonPreviewContainer';
import LessonPreview from './Lesson/LessonPreview';
import ToggleDisplay from 'react-toggle-display';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      favoriteLessons: [],
      read: [],
      types: {},
      show: false
    }
    this.deleteLesson = this.deleteLesson.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  deleteLesson(lessonId) {
    return fetch('/lessons/' + lessonId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((deletedlesson) => {
      let newState = this.state.lessons.filter(lesson => lesson._id !== lessonId)
      console.log('new state: ', newState);
      this.setState({lessons: newState});
    })
    .catch((err) => console.log('Error deleting lessons', err));
  }

  componentDidMount() {
    this.props.getLessons()
    .then((unfilteredLessons) => {
      console.log('not filtered: ', unfilteredLessons);
      return {
        lessons: unfilteredLessons.filter(lsn => this.props.user._id === lsn.userRef),
        favoriteLessons: unfilteredLessons.filter(lsn => lsn.userLikes.indexOf(this.props.user.username) >= 0)
      }
    })
    .then((lesson) => this.setState({lessons: lesson.lessons, favoriteLessons: lesson.favoriteLessons}))
    .then(() => {
      var readCount = [];
      var newObj = this.state.types;
      this.state.lessons.forEach( function(lesson) {
        // console.log('lesson', lesson)
        // readCount = readCount + (lesson.read || 0);
        var newArr = [];
        newArr.push(lesson.name)
        lesson.read ? newArr.push(lesson.read) : newArr.push(0);
        readCount.push(newArr);
        
        newObj[lesson.name] = 'bar';
        // console.log('newObj', newObj);
      })
      this.setState({
        read: readCount
      })
    })
    .catch((err) => console.log('Error! ', err));

  }

  handleClick() {
    this.setState({
      show: !this.state.show
    })
  }

  render() {
    var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: this.state.read,
        type: 'bar'
      },
      bar: {
        width: {
          ratio: .8
        }
      },
      tooltip: {
        grouped: false
      },
      axis: {
        y: {
          label: {
            text: 'Number of times viewed',
            position: 'outer-middle'
          }
        }
        // x: {
        //   label: {
        //     text: 'Lesson Name',
        //     position: 'outer-center'
        //   }
        // }
      }
    });
    return (
      <div>
      <ListGroup>
        <ListGroupItem>Username: { this.props.user.username || 'no username!' }</ListGroupItem>
        <ListGroupItem>
            <Button block>Your Favorite Lessons</Button>
              <div key={ this.props.user._id + 1 }>
                { this.state.favoriteLessons.length === 0 ? 'You Have No Favorite Lessons!' :
                  (this.state.favoriteLessons.map((lesson, i) => 
                    <div key={ lesson._id }>
                    Lesson Name: {lesson.name || 'Unnamed Lesson'} 
                    <br/>
                    Lesson Description: {lesson.description || 'no description'} 
                    <Link to={'/lesson/' + lesson._id}>
                      <Button bsStyle="primary" bsSize="small" block>View Lesson</Button>
                    </Link>
                    </div>
                  )
                )}
              </div> 
        </ListGroupItem>
        <ListGroupItem>
            <Button block>Your Lessons</Button>
              <div key={ this.props.user._id }>
                { this.state.lessons.length === 0 ? 'You Have No Lessons!' :
                  (this.state.lessons.map((lesson, i) => 
                    <div key={ lesson._id }>
                    Lesson Name: {lesson.name || 'Unnamed Lesson'}
                    <br/>
                    Lesson Description: {lesson.description || 'no description'} 
                    <Link to={'/lesson/' + lesson._id}>
                      <Button bsStyle="primary" bsSize="small" block>View Lesson</Button>
                    </Link>
                    <Button bsStyle="primary" bsSize="small" onClick={ () => this.deleteLesson(lesson._id) } block>Delete Lesson</Button>
                    </div>
                  )
                )}
              </div> 
        </ListGroupItem>
      </ListGroup>
      <Button className="showGraph" onClick={this.handleClick}> My Stats </Button>
      <ToggleDisplay show={this.state.show}>
        <div id='chart'>
        </div>
      </ToggleDisplay>
      </div>
    );
  } 
}

export default User;
// {this.state.lessons.length > 0 ? (<LessonPreviewContainer lessons={ this.state.lessons }/>) : '' }