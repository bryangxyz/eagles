import React, { Component } from 'react';
import LessonPreview from "./LessonPreview.js";
import { ListGroup, Button } from 'react-bootstrap';

class LessonPreviewContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.lessons) this.props.getLessons();
  }

  render() {
    return (
      <div>
        <div className="browseLessons">
          <h1 className="browseTitle">Browse Lessons</h1>
          <h3 style={{marginBottom: "35px"}}>Sort by:</h3>
          <div>
            <Button  className="stdButton" bsStyle="btn-primary" bsSize="small" onClick={this.props.organizeSearchResultsBasedOnMostLikes} >Likes</Button>
            <Button  className="stdButton" bsStyle="btn-primary" bsSize="small" onClick={this.props.sortByViews} >Views</Button>
            <Button  className="stdButton" bsStyle="btn-primary" bsSize="small" >Date</Button>
          </div>
        </div>
        <div className="LessonPreviewContainer">
          <ListGroup>
          {this.props.lessons.map((lesson, i) => 
            <LessonPreview 
              lesson={lesson} 
              index={i}
              key={i}
            /> 
          )}
          </ListGroup>
        </div>
      </div>
    )
  };
} 
  

export default LessonPreviewContainer;