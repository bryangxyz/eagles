import React from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import $ from 'jquery';
import { Grid, Row, Col, FormControl, Form, ControlLabel, Button} from 'react-bootstrap';

class Player extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      videoTime: "",
      videoAnnotation: "",
      annotations: this.props.annotations || [],

    }
    this.handleAnnotate = this.handleAnnotate.bind(this);
    this.handleSetNote = this.handleSetNote.bind(this);
    this.handleAnnotateTimer = this.handleAnnotateTimer.bind(this);
    this.timeConverter = this.timeConverter.bind(this);
    this.ref = player => {
      this.player = player
    }
  }

  componentDidMount(){
    // Reset time stamp of annotation if user chooses to press Enter
    $('.annotate').on('keypress', (e) => {
      if(event.which === 13){
        this.handleAnnotateTimer(); 
      }
    })
  }

  handleAnnotate(e){
    // Keep track of current annotation input
    this.setState({videoAnnotation: e.target.value})
  }

  handleAnnotateTimer(){
    // Keep track of time stamp of annotation
    var time = Math.floor(this.player.getCurrentTime());
    console.log(time);
    this.setState({videoTime: time});
  }

  handleSetNote(e){
    // Add annotation 
    e.preventDefault();
    this.props.grabAnnotations({time: this.state.videoTime, text: this.state.videoAnnotation});
    $('.annotate').val('');
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
          <Col xs={6} md={4} className="sideNotes">
          {this.props.annotations.map((notes,i) => {
            return <h4 key={i}>{this.timeConverter(notes.time)}: {notes.text}</h4>
          })}
          </Col>
        </Row>
        </Grid>
        <div className="searchBar">
          <FormControl  className="formWidth" type="text" onChange={this.handleAnnotate} onClick={this.handleAnnotateTimer} className="annotate formWidth" placeholder="Add annotation" />
          <Button bsStyle="primary" onClick={this.handleSetNote} >Add</Button>
        </div>
      </div>
    );
  }
 
}

export default Player;