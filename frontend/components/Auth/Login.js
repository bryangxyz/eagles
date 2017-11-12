import React, { Component } from 'react';
import { Thumbnail, Form, FormGroup, Col, FormControl, ControlLabel, Button, Panel, InputGroup, Glyphicon } from 'react-bootstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      creatingAccount: false,
      email: ''
    }
  }

  render() {
    window.localStorage.setItem('username',this.state.username);

    return (
        <div className="backgroundLogin">
        <div className="loginBox">
        <Form horizontal onSubmit={(e) => e.preventDefault()}>
          <FormGroup>
            {
              this.props.displayLogginError ?
              (<Panel header='Login Error!' bsStyle="danger"></Panel>) : ''
            }
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Username</Col>
            <Col sm={6}>
              <InputGroup>
              <InputGroup.Addon><Glyphicon glyph="user" /></InputGroup.Addon>
              <FormControl className="formWidth" type='text' placeholder='Username'
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
              </InputGroup>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Password</Col>
            <Col sm={6}>
            <InputGroup>
              <InputGroup.Addon><Glyphicon glyph="lock" /></InputGroup.Addon>
              <FormControl className="formWidth" type='password' placeholder='Password'
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
              </InputGroup>
            </Col>
          </FormGroup>
          { this.state.creatingAccount ?
          (<FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Email</Col>
            <Col sm={6}>
            <InputGroup>
              <InputGroup.Addon><Glyphicon glyph="envelope" /></InputGroup.Addon>
              <FormControl className="formWidth" type='email' placeholder='Email'
                value={this.state.email}
                onChange={(e) => this.setState({ email: e.target.value })}
              />
              </InputGroup>
            </Col>
          </FormGroup>) : ''
          }
      { !this.state.creatingAccount ? (
          <FormGroup>
            <Col className="loginButtons" smOffset={1} sm={6}>
              <Button className="loginButtonEntry" onClick={() => this.props.login(this.state.username, this.state.password)}>
                Sign In
              </Button>
              <Button className="loginButtonEntry" onClick={() => this.setState({ creatingAccount: true })}>
                Sign Up
              </Button>
            </Col>
          </FormGroup>
          ) : (
            <FormGroup>
            <Col className="loginButtons" smOffset={1} sm={6}>
              <Button className="loginButtonEntry" onClick={ () => this.setState({ creatingAccount: false }) }>
                Go Back
              </Button>
              <Button className="loginButtonEntry" onClick={() => {
                this.props.createAccount(this.state.username, this.state.password, this.state.email);
                }}>
                Create Account
              </Button>
            </Col>
            </FormGroup>
          )}
        </Form>
          </div>
          </div>
        )
    }
}

export default Login;
