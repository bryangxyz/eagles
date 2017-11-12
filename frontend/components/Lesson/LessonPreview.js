import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ListGroupItem, Header, Button } from 'react-bootstrap';

const LessonPreview = (props) => {
  console.log(props);
  const read = props.lesson.read ? props.lesson.read : 0;
  return (
    <div className="LessonPreview">
      <ListGroupItem header={props.lesson.name || 'no name'}>
          {props.lesson.description || 'no description'} 
          <p>{`Tags: ${props.lesson.keyWords}`}</p>
          <br />
        <Link to={'/lesson/' + props.lesson._id}>
          <Button bsStyle="primary" bsSize="small" >View Lesson</Button>
        </Link>
         <h5 className="lessonRead"> Read Times: {read} </h5>
      </ListGroupItem>
    </div>
  )
}

export default LessonPreview;