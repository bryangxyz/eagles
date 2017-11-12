import React from 'react';
import axios from 'axios';
import VideoSearch from './VideoSearch.js';
import { Form, FormGroup, Col, FormControl, ControlLabel, Button } from 'react-bootstrap';

class SlideCreator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: props.slide.name || '',
      youTubeUrl: props.slide.youTubeUrl || '',
      youTubeThumbnailUrl: props.slide.youTubeThumbnailUrl || '',
      annotations: [],
      youTubeTags: props.slide.youTubeTags || '',
      text: props.slide.text || '',
      quizUrl: props.slide.quizUrl || '',
      old: props.slide.old || '',
      lessonRef: props.lessonRef,
      articleUrl: props.slide.articleUrl || '',
      articleImage: '',
      showVideoSearch: false
    }
    this.grabYouTubeVideo = this.grabYouTubeVideo.bind(this);
    this.grabAnnotations = this.grabAnnotations.bind(this);
    this.showVideoSearch = this.showVideoSearch.bind(this);
  }
  reset () {
    this.setState({
      name: '',
      youTubeUrl: '',
      youTubeThumbnailUrl: '',
      youTubeTags: '',
      text: '',
      quizUrl: '', 
      annotations: [],
      articleUrl: '' 
    });
  }

  onSubmit (event) {
    event.preventDefault();
    console.log('the article URL', this.state.articleUrl);
    if(this.state.articleUrl){
      if (this.state.name !== '') {
      axios.post('/screenshot', {url: this.state.articleUrl})
      .then((response) => {
        console.log('article response', response.data);
        this.setState({articleImage: response.data});
      })
      .catch(error => {
        console.log('No article');
      })
      .then(() => {
        fetch('/slides', {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include"
          })  
          .then((something) => something.json())
          .then(result => {
            console.log(result, ' that was result this.state is', this.state);
            this.props.fetch(result);
            this.reset();
          })
      })
      } else {
          alert('Slide name required. Please enter a slide name.');
      }
    } else {
      if (this.state.name !== '') {
        fetch('/slides', {
            method: "POST",
            body: JSON.stringify(this.state),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include"
          })  
          .then((something) => something.json())
          .then(result => {
            console.log(result, ' that was result this.state is', this.state);
            this.props.fetch(result);
            this.reset();
          })
      } else {
          alert('Slide name required. Please enter a slide name.');
      }
    }
  }

  updateOldSlide () {
    var id = this.props.slide._id;
    var body = this.state;
    body.id = id;
    fetch('/slides',{
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })    
    .then(function(result) {
      return result.json();
    })
    .then(function(result) {
      console.log('from line111 slidecreator result after update is', result);
    })
    .catch(function(err) {
      console.log('line 114 err', err);
    })
  }

  youTubeQueryToServer(searchString, cb) {
    fetch('/query?string=' + searchString, {
      method: "GET",
       headers: {
          "Content-Type": "application/json",
        },
      credentials: "include"
    })
    .then((something) => something.json())
    .then((result) => {
      console.log('Youtube query sent to server', result[0]);
      cb(result[0]);
    })
    .catch((err) => {
      console.log('Error: youtube query not sent to server', err);
    })
  }

  grabYouTubeVideo(video,thumb){
    this.setState({youTubeUrl: video, youTubeThumbnailUrl: thumb});
  }

  grabAnnotations(notes){
    this.setState({annotations: this.state.annotations.concat(notes)});
  }

  showVideoSearch(e){
    e.preventDefault();
    this.setState({showVideoSearch: !this.state.showVideoSearch});
  }

  render () {
    return (
      <div>
      <Form className="slideCreationForm" horizontal onSubmit={this.onSubmit.bind(this)}>
        <FormGroup>
          <div className='slideCreator'>
            <ControlLabel>Slide Creator</ControlLabel>
          </div>
        </FormGroup>
        <div className="videoSearcher">
          {this.state.showVideoSearch ? 
          <VideoSearch resetNotes= {this.resetNotes} 
                       grabYouTubeVideo={this.grabYouTubeVideo} 
                       grabAnnotations={this.grabAnnotations} 
                       primaryTag={this.props.primaryTag}
                       annotations={this.state.annotations}/>
          : 
          <Button bsStyle="primary" onClick={this.showVideoSearch}>Use a video</Button>
          }
        </div>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide Name</Col>
          <Col sm={4}>
            <FormControl className="formWidth" type='text' placeholder='Slide Name'
              value={this.state.name}
              onChange={(event) => this.setState({name: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide Text</Col>
          <Col sm={4}>
            <FormControl className="formWidth" type='text' placeholder='Slide Text'
              value={this.state.text}
              onChange={(event) => this.setState({text: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide QuizUrl</Col>
          <Col sm={4}>
            <FormControl className="formWidth" type='Quiz Url' placeholder='Quiz Url'
              value={this.state.quizUrl}
              onChange={(event) => this.setState({quizUrl: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Slide ArticleUrl</Col>
          <Col sm={4}>
            <FormControl className="formWidth" type='text' placeholder='Article Url'
              value={this.state.articleUrl}
              onChange={(event) => this.setState({articleUrl: event.target.value})}
            />
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={2}>
            { this.state.old === '' ? 
              (<Button type="submit" bsStyle="primary" bsSize="small">Create The Slide</Button>) : 
              (<Button onClick={this.updateOldSlide.bind(this)} bsStyle="primary" bsSize="small">
                Update Slide
              </Button>) 
            }
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={2}>
            { this.state.old === '' ? 
              (<Button onClick={this.props.changeCreateState} bsStyle="warning" bsSize="small">
                Go Back
              </Button>)
              :
              (<Button onClick={this.props.changeEditingOldSlide} bsStyle="warning" bsSize="small">
                Finish Update
              </Button>)
            }
          </Col>
        </FormGroup>
      </Form>
      </div>
    );
  }

}


export default SlideCreator;