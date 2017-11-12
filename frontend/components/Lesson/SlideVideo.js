import React from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import $ from 'jquery';
import {Grid, Col, Row} from 'react-bootstrap';
class SlideVideo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      videoTime: "",
      videoAnnotation: "",
      annotations: [],
      renderNotes: [],
      currentTime: "",
      checker: ""
    }
    this.ref = player => {
      this.player = player
    }
    this.checkTime = this.checkTime.bind(this);
    this.timeConverter = this.timeConverter.bind(this);
  }

  componentDidMount(){
    // Timer checks current time of video against timed annotations
    var checker = setInterval(() => {this.checkTime()}, 500); 
    this.setState({checker: checker});
  }

  componentWillUnmount(){
    // Clears setInterval calls once page is redirected
    clearInterval(this.state.checker);
  }

  checkTime(){
    // Get current time of playing video
    var time = Math.floor(this.player.getCurrentTime());
    this.setState({currentTime: time}, );
  }

  timeConverter(seconds){
    // Present time in human form
    var mins = Math.floor(seconds / 60);
    var seconds = seconds % 60;
    if(seconds < 10){
      seconds = '0' + seconds;
    }
    return mins + ':' + seconds;
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
    };
    return (
      <div>
      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={8}>
        <ReactPlayer
          ref={this.ref}
          config={{
            youtube: {
              playerVars: { showinfo: 1 , controls: 1}
            } 
          }}
          url={`https://www.youtube.com/watch?v=${this.props.currentVideoURL}`}/>
          </Col>
          <Col xs={6} md={4}>
          {this.props.annotations ?
            this.props.annotations.map((notes,i) => {
              if(this.state.currentTime > notes.time ){
              return <h4 className="annotations" key={i}>{this.timeConverter(notes.time)}: {notes.text}</h4>
              }
            }) 
            : null
            } 
          </Col>
        </Row>
        </Grid>
      </div>
    );
  }
 
}

export default SlideVideo;