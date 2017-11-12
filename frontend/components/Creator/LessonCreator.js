import React from 'react';
import axios from 'axios';//use in functions
import {Link} from 'react-router-dom';
import SlideCreator from './SlideCreator.js';
import { InputGroup, Form, FormGroup, Col, FormControl, ControlLabel, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

class LessonCreator extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      name: '',
      userRef: this.props.userRef,
      description: '',
      slides: [],
      slidesId: [],
      creatingSlide: false,
      lessonid: 'No ID Yet',
      keyWords: [],
      clientShownKeyWords: '',
      editingOldSlide: false,
      oldSlide: ''
    };
  }
  onSubmit (event) {
    event.preventDefault();
    var lessonObj = {
      name: this.state.name,
      userRef: this.state.userRef,
      description: this.state.description,
      slides: this.state.slides

    };

    fetch('/lessons', {
      method: "POST",
      body: JSON.stringify(lessonObj),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((anything) => anything.json())
    .then((result) => {
      console.log('result is',result);
      this.setState({
        lessonid: result._id // setting lessonid to the lesson object's id
      })
      console.log('state now is ', this.state);
    })
  }
  seeOldSlide (slide) {
    console.log('this is the event after clicking ', slide);
    var indexOfSlideId = this.state.slides.indexOf(slide);
    var slideId = this.state.slidesId[indexOfSlideId];
    console.log(slideId,indexOfSlideId);
    var url = '/slides/' + slideId;
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then(result => result.json())
    .then((result) => {
      console.log('result of retrieving slide by id',result[0])
      var oldSlide = result[0];
      oldSlide.old = true;
      this.setState({
        oldSlide: oldSlide,
        editingOldSlide: !this.state.editingOldSlide
      });
    });
  }
  seeOldSlideFromLesson (slide) {
    console.log('this is the event after clicking ', slide);
    var indexOfSlideId = this.state.slides.indexOf(slide);
    var slideId = this.state.slidesId[indexOfSlideId];
    console.log(slideId,indexOfSlideId);
    var url = '/slides/' + slideId;
    fetch(url, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then(result => result.json())
    .then((result) => {
      console.log('result of retrieving slide by id',result[0])
      var oldSlide = result[0];
      oldSlide.old = true;
      this.setState({
        oldSlide: oldSlide,
        editingOldSlide: !this.state.editingOldSlide,
        creatingSlide: !this.state.creatingSlide
      });
    });
  }
  keyWordSubmit (event) {
    event.preventDefault();
    console.log('keyWordSubmit triggered keyWords look like ', this.state.clientShownKeyWords);
    var keyWords = this.state.clientShownKeyWords.split(',');
    this.setState({
      keyWords: this.state.keyWords.concat(keyWords)
    }, ()=>{
      var body = { keyWords: this.state.keyWords, lessonid: this.state.lessonid };
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
      .then(function(result) {
        console.log('from line62 lessoncreator result after keyword update is', result);
      })
      .catch(function(err) {
        console.log('line 70 err', err);
      })
    })
  }
  changeClientKeyWords (event) {
    var keyWords = event.target.value;
    this.setState({
      clientShownKeyWords: keyWords
    })
  }
  changeName (event) {
    this.setState({
      name: event.target.value
    });
  }

  changeDescription (event) {
    this.setState({
      description: event.target.value
    });
  }
  
  changeCreateState (event) {
    console.log('changingcreatestate')
    this.setState({
      creatingSlide: !this.state.creatingSlide
    })
  }
  changeEditingOldSlide (event) {
    console.log('changeEditingOldSlide')
    this.setState({
      creatingSlide: !this.state.creatingSlide,
      editingOldSlide: !this.state.editingOldSlide
    });
  }
  reset () {
    this.setState({
      name: '',
      userRef: this.props.userRef,
      description: '',
      slides: [],
      slidesId: [],
      creatingSlide: false,
      lessonid: 'No ID Yet',
      keyWords: [],
      clientShownKeyWords: '',
      editingOldSlide: false,
      oldSlide: ''
    });
  }
  // goHome (event) {
  //   fetch('/',{
  //     method: "GET",
  //     headers: {
  //       "Content-Type":"application/json"
  //     },
  //     credentials: "include"
  //   })
  // }
  fetchSlideFromSlideCreator (result) {
    console.log(result);
    var slideName = result.name; 
    var slideId = result._id;
    console.log('this is the result line119 lessoncreator', result);
    this.setState({
      slides: this.state.slides.concat(slideName), //pushing in slide object's id into slides;
      slidesId: this.state.slidesId.concat(slideId)
    })
  }
  render () {
    if (!this.state.creatingSlide) {
      return (
        <Form horizontal onSubmit={this.onSubmit.bind(this)}>
          <FormGroup>
            <div className='lessonCreator'>
              <ControlLabel>Lesson Creator</ControlLabel>
            </div>
          </FormGroup>

          { this.state.lessonid === 'No ID Yet' ? null : 
            ( <div className="creationListHead">
          <ListGroup className="creationListGroup">
            <ListGroupItem>Lesson Name: {this.state.name} </ListGroupItem>
            <ListGroupItem>Lesson Description: {this.state.description}</ListGroupItem>
            <ListGroupItem>Lesson Tags: {this.state.keyWords.join(', ')}</ListGroupItem>
          </ListGroup>
          </div>) 
          }
          <div className="lessonInputs">
          { this.state.lessonid === 'No ID Yet' ? (<FormGroup style={{maxWidth: 240}}>
            <InputGroup>
            <ControlLabel>Lesson Name</ControlLabel>
              <FormControl className="formWidth" type='text' placeholder='Lesson Name'
                value={this.state.name}
                onChange={this.changeName.bind(this)}
              />
            </InputGroup>
          </FormGroup>) : null }
          
          { this.state.lessonid === 'No ID Yet' ? (<FormGroup style={{maxWidth: 240}}>
            <InputGroup>
            <Col componentClass={ControlLabel}>Lesson description</Col>
              <FormControl style={{maxWidth: 240}} className="formWidth" type='text' placeholder='Lesson Description'
                value={this.state.description}
                onChange={this.changeDescription.bind(this)}
              />
            </InputGroup>
          </FormGroup>) : null }

          {this.state.lessonid === 'No ID Yet' ? null : <FormGroup>
            <Col componentClass={ControlLabel} style={{marginRight:"10px"}}>Add Tags To Lesson</Col>
            <Col>
                <FormControl className="formWidth" type='text' 
                  value={this.state.clientShownKeyWords}
                  onChange={this.changeClientKeyWords.bind(this)}
                />
                <Button onClick={this.keyWordSubmit.bind(this)} 
                  bsStyle="primary" 
                  bsSize="small"
                  style={{margin: "20px"}}> Set Tags </Button>
            </Col>
          </FormGroup>}
          </div>

          <div className="lessonMakerButtons">
          <FormGroup>
            { 
              this.state.lessonid === 'No ID Yet' ? 
              (<Col >
                <Button type="submit" bsStyle="warning" bsSize="small">
                  Make Lesson
                </Button>
              </Col>) :
              (<Col >
                <Button 
                onClick={this.changeCreateState.bind(this)}
                bsStyle="warning" 
                bsSize="small">Go To Slide Creator</Button>
              </Col>)
            }
            {this.state.lessonid === 'No ID Yet' ? null :
              (<Col >
                <Button type="button" 
                  onClick={this.reset.bind(this)} 
                  bsStyle="warning" 
                  bsSize="small">Make New Lesson</Button>
              </Col>)
            }
            { 
              <Col>
                <Link to='/'>
                  <Button type="button" bsStyle="warning" bsSize="small">Go Home</Button>
                </Link>
              </Col>
            }
          </FormGroup>
          </div>
          {this.state.creatingSlide ?
          this.state.slides.length === 0  ? 
            (<div>No Slides Yet</div>) 
            : 
            (<div>Lesson Slides: 
              {
                this.state.slides.map((slide,i) => {
                  return <Button key={i} 
                  onClick={this.seeOldSlideFromLesson.bind(this,slide)}
                  bsStyle="info" 
                  bsSize="small">
                  {slide}
                  </Button>
                })
              }
            </div>)
            : null
          }
        </Form>
      )
    } else if (this.state.creatingSlide && !this.state.editingOldSlide) {
      return (
        <div>
            <FormGroup>
          <div className='lessonCreator'>
              <ControlLabel>Lesson</ControlLabel>
            </div>
            </FormGroup>
          <div className="creationListHead">
          <ListGroup className="creationListGroup">
            <ListGroupItem>Lesson Name: {this.state.name} </ListGroupItem>
            <ListGroupItem>Lesson Description: {this.state.description}</ListGroupItem>
            <ListGroupItem>Lesson Tags: {this.state.keyWords.join(', ')}</ListGroupItem>
          </ListGroup>
          </div>
          <SlideCreator 
            slide={{}} 
            lessonRef={this.state.lessonid} 
            fetch={this.fetchSlideFromSlideCreator.bind(this)} 
            changeCreateState={this.changeCreateState.bind(this)} 
            changeEditingOldSlide={this.changeEditingOldSlide.bind(this)}
            primaryTag={this.state.keyWords[0]}>
          </SlideCreator>
          <div>Lesson Slides: 
            {
              this.state.slides.map((slide,i) => {
                return <Button key={i} 
                onClick={this.seeOldSlide.bind(this,slide)}
                bsStyle="info" 
                bsSize="small">{slide}</Button>
              })
            }
          </div>
        </div>
      )
    } else if (this.state.creatingSlide && this.state.editingOldSlide) {
      return (
        <div>
        <FormGroup>
          <div className='lessonCreator'>
              <ControlLabel>Lesson</ControlLabel>
            </div>
            </FormGroup>
          <ListGroup>
            <ListGroupItem>Editing An Old Slide</ListGroupItem>
            <ListGroupItem>Lesson Name: {this.state.name}</ListGroupItem>
            <ListGroupItem>Lesson Description: {this.state.description}</ListGroupItem>
            <ListGroupItem>Lesson Tags: {this.state.keyWords.join(', ')}</ListGroupItem>
          </ListGroup>
          <SlideCreator 
            slide={this.state.oldSlide} 
            lessonRef={this.state.lessonid} 
            fetch={this.fetchSlideFromSlideCreator.bind(this)} 
            changeCreateState={this.changeCreateState.bind(this)} 
            changeEditingOldSlide={this.changeEditingOldSlide.bind(this)}
            primaryTag={this.state.keyWords[0]}>
          </SlideCreator>
        </div>
      )
    }
  }   
}

export default LessonCreator;