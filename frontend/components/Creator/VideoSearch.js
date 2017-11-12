import React from 'react';
import {findDOMNode} from 'react-dom';
import axios from 'axios';
import $ from 'jquery';
import ReactPlayer from 'react-player';
import Player from './Player.js'
import {Col, Thumbnail, Button, FormControl} from 'react-bootstrap';

class VideoSearch extends React.Component { 
  constructor(props) {
  super(props);
  this.state = {
    currentVideoURL: "",
    currentThumbnail: "",
    currentQuery: this.props.primaryTag, 
    suggestions: [],
    videoTime: "",
    videoAnnotation: ""
  }
  this.handleSearch = this.handleSearch.bind(this);
  this.handleInput = this.handleInput.bind(this);
  this.handleVideoChange = this.handleVideoChange.bind(this);
}
  componentDidMount(){
    // Render inital suggestions based on primary tag
    this.handleSearch();
  }

  handleSearch(e){
    if(e){
      e.preventDefault();
    }
    // Get youtube suggestions 
    axios.post('/youtube', {query : this.state.currentQuery})
    .then((data) => {
      console.log('our query', this.state.currentQuery);
      this.setState({suggestions: data.data.items}) // set suggestions to results from youtube search
    })
    .then(() => {
      console.log(this.state.suggestions);
      this.props.grabYouTubeVideo(this.state.suggestions[0].id.videoId, this.state.suggestions[0].snippet.thumbnails.default.url);
      this.setState({currentVideoURL: this.state.suggestions[0].id.videoId});
      this.setState({currentThumbnail: this.state.suggestions[0].snippet.thumbnails.default.url});
    })
    .catch((error) => {
      console.log('Error searching YouTube');
    })
    $('.searchBar').val('');
  }

  handleInput(e){
    // Handle search input
    this.setState({currentQuery: e.target.value});
  }

  handleVideoChange(e){
    // Select new video from suggestions
    console.log('newVideo is ', e.target.id);
    this.setState({currentVideoURL: e.target.id, currentThumbnail: e.target.src}, () => {
    this.props.grabYouTubeVideo(this.state.currentVideoURL, this.state.currentThumbnail); 
    });
  }

  render() {
    return (
      <div className="videoPlayer">
        <div className="searchBar">
          <FormControl className="formWidth searchBar" onChange={this.handleInput} type="text" placeholder="Search for videos" />
          <Button bsStyle="primary" onClick={this.handleSearch}>Search</Button>
        </div>
        {this.state.currentVideoURL ?
          <Player resetNotes={this.props.resetNotes} 
                  currentVideoURL={this.state.currentVideoURL} 
                  grabAnnotations={this.props.grabAnnotations}
                  annotations={this.props.annotations}/>
          : null
        }
        <div className="suggestionsBar">
        {this.state.suggestions.map((items,i) => {
          return <Col xs={6} md={4} onClick={this.handleVideoChange} id={`${items.id.videoId}`} key={i}>
            <Thumbnail src={`${items.snippet.thumbnails.default.url}`}/>
            <h3 onClick={this.handleVideoChange} id={`${items.id.videoId}`} >{items.snippet.title}</h3>
            <p>{items.snippet.description}</p> 
          </Col>
        })
       }
       </div>
      </div>
    );
  }
}


export default VideoSearch;