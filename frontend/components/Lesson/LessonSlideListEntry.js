import React from 'react';
import { Thumbnail, Well, Col } from 'react-bootstrap'

const LessonSlideListEntry = (props) => (
    !props.slide.youTubeThumbnailUrl.length ? 
    (<Col xs={6} md={4}>
      <Well onClick={() => props.onLessonSlideListEntryClick(props.index)}>
        <h4 className="index">Slide: {props.index + 1}</h4>
        <h4> Slide Name: {props.slide.name || 'No Slide Name'} </h4>
      </Well>
    </Col>)  :
    (<Col xs={6} md={4}>
      <Well>
      <Thumbnail src={props.slide.youTubeThumbnailUrl} alt="" onClick={() => props.onLessonSlideListEntryClick(props.index)}>
        <h4 className="index">Slide: {props.index + 1}</h4>
        <h4> Slide Name: {props.slide.name || 'No Slide Name'} </h4>
      </Thumbnail>
      </Well>
    </Col>)
);


export default LessonSlideListEntry;