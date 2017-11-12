import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { InputGroup, Glyphicon, Button, ButtonToolbar, Form, FormGroup, ControlLabel, FormControl, Navbar } from 'react-bootstrap';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: ''
    }
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  retrieveSearchInput(searchInput) {
    this.setState({
      searchInput: searchInput.target.value
    });
  }

  handleSearchSubmit(event) {
    event.preventDefault();
    this.props.queryDataBaseWithSearchInput(this.state.searchInput);
  }

  render(props) {
    return (
      <Navbar>
        <div>
        <Navbar.Header>
            <img className="logo" src="../img/logo.png" height="50px" width="50px"/>
            <h1 className="title" href="/">Legacy Learning</h1>
          <Navbar.Toggle />
        </Navbar.Header>
        </div>
        <div >
        <Navbar.Form pullRight>
          <Form onSubmit={ (e) => {
            e.preventDefault();
            this.retrieveSearchInput.call(this, event);
            this.props.history.push('/');
          }}>
            <FormGroup>
              <InputGroup>
              <FormControl className="formWidth" type='text' placeholder='Enter a search term!' onChange={this.retrieveSearchInput.bind(this)}/>
                    <InputGroup.Addon className="searchIcon" onClick={ (event) => {
                    this.handleSearchSubmit(event);
                    this.props.history.push('/');
                  }}><Glyphicon glyph="search" /></InputGroup.Addon>
              </InputGroup>
            </FormGroup>{' '}
          <span>
          <Link to='/'>
            <Button className="navButton" onClick={ this.props.getLessons }>Home</Button>
          </Link>{' '}
          <Link to='/create'>
            <Button className="navButton">Create</Button>
          </Link>{' '}
          <Link to='/user'>
            <Button className="navButton">Your Account</Button>
          </Link>{' '}
          <Link to='/notification'>
            <Button className="navButton">Notifications</Button>
          </Link>{' '}
          <Button className="navButton" onClick={this.props.logout}>Logout</Button>{' '}
        </span>
        </Form>
        </Navbar.Form>
        </div>
      </Navbar>
    );
  }
}

export default NavBar;


// Can change input and button to elements within a form field which should mean you can submit by hitting enter as well as clicking submit
