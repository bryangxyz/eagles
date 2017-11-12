import React from 'react';
import { Button, Pager } from 'react-bootstrap';
import SlideVideo from './SlideVideo.js';
import $ from 'jquery';
var TextHighlighter = require("texthighlighter");


class Slide extends React.Component { 
  constructor(props) {
  super(props);
  this.state = {
    editing: false
  }
  this.editMode = this.editMode.bind(this);
}

  editMode(){
    this.setState({editing : true});
  }
  render() {
    return (
    <div>
      <h1>{ this.props.slideData.name || 'No Slide Name' }</h1>
      { this.props.videoIdOfClickedOnVideo ? (
        <SlideVideo currentVideoURL={this.props.videoIdOfClickedOnVideo} annotations={this.props.slideData.annotations}/>
      ) : (
        <div></div>
      )}
        <p className="slideText">{this.props.slideData.text}</p>
      {this.props.slideData.articleUrl ?
        <button onClick={this.editMode}>Explore</button>
        : null
      }  
      {this.props.slideData.articleImage && !this.props.videoIdOfClickedOnVideo ?
        <div className="articleSlide"> 
            {this.state.editing ?
             <iframe ref="article" className="editArticle" height= '1000px' width= '1000px' src={`${this.props.slideData.articleUrl}`}></iframe> 
            : <img src={`https://screenshotapi.s3.amazonaws.com/captures/${this.props.slideData.articleImage}.png`}/>
            }
        </div>
      : null
      }  
      <div> 
          <p>{this.props.slideData.quizUrl}</p>
      </div>
      <Pager>
        <Pager.Item previous onClick={() => this.props.previousSlideClick(this.props.index)}>&larr; Previous Slide</Pager.Item>
        <Pager.Item next onClick={() => this.props.nextSlideClick(this.props.index)}>Next Slide &rarr;</Pager.Item>
      </Pager>
        <Button type="button" onClick={() => this.props.exitClick()}>Exit</Button>
      
    </div>
    );
  }
}


export default Slide;