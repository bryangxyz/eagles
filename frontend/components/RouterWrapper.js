import React, { Component } from 'react';
import App from './App';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LessonPreviewContainer from './Lesson/LessonPreviewContainer.js';
import Lesson from './Lesson/Lesson.js';
import LessonCreator from './Creator/LessonCreator';
import User from './User';
import Login from './Auth/Login';
import Notification from './Notification.js';
import { Carousel } from 'react-bootstrap';


class RouterWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      loggedIn: false,
      displayLogginError: false,
      user: {}
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getLessons = this.getLessons.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.queryDataBaseWithSearchInput = this.queryDataBaseWithSearchInput.bind(this);
    this.organizeSearchResultsBasedOnMostLikes = this.organizeSearchResultsBasedOnMostLikes.bind(this);
    this.sortByViews = this.sortByViews.bind(this);
  }

  componentDidMount() {
    this.getLessons();
  }

  getLessons() {
    return fetch('/lessons', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((lessons) => {
      this.setState({lessons});
      console.log(lessons);
      return lessons
    })
    .catch((err) => console.log('Error getting lessons', err));
  }

  queryDataBaseWithSearchInput(searchInput) {
    this.getLessons()
    .then((results) => {
      var filteredLessons = this.state.lessons.filter((lesson) => {
        var lowerSearchInput = searchInput.toLowerCase();
        if (lesson.keyWords.includes(lowerSearchInput) || lowerSearchInput === '') {
          return lesson;
        }
      });
      this.setState({
        lessons: filteredLessons,
      });
      console.log(this.state.lessons)
    })
  }

  organizeSearchResultsBasedOnMostLikes() {
    var lessons = this.state.lessons;
    lessons.sort(function(lesson1, lesson2) {
      return lesson2.likes - lesson1.likes;
    })
    this.setState({
      lessons: lessons
    });
  }

  sortByViews(){
    var lessons = this.state.lessons;
    lessons.sort(function(lesson1, lesson2) {
      return lesson2.read - lesson1.read;
    })
    this.setState({
      lessons: lessons
    }); 
  }

  createAccount(username, password, email) {
    let data = {
      username,
      password,
      email
    };
    fetch('/users', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('got data', data);
      if(data.loggedIn === true) {
        this.setState({
          user: data.userData,
          loggedIn: true,
          displayLogginError: false
         });
      } else {
        this.setState({ displayLogginError: true });
      }
    })
    .catch((err) => console.log('Error creating an account!', err));
  }

  login(username, password, email) {
    let data = {
      username: username,
      password: password,
      email: email
    };
    fetch('/login', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('login got data', data);
      if(data.loggedIn === true) {
        this.getLessons();
        this.setState({
          user: data.userData,
          loggedIn: true,
          displayLogginError: false
         });
      } else {
        this.setState({ displayLogginError: true });
      }
    })
    .catch((err) => console.log('Error Logging In!', err));
  }

  logout() {
    console.log('logging out');
    fetch('/logout', {
      method: "GET",
      credentials: "include"
    });
    this.setState({
      loggedIn: false,
      displayLogginError: false,
      user: {}
     });
  }

  render() {
    const LessonPage = (props) => {
      return (
        <Lesson user={this.state.user}/>
        )
    }
    return (
      <BrowserRouter>
        <App
        queryDataBaseWithSearchInput={ this.queryDataBaseWithSearchInput }
        logout={ this.logout }
        getLessons={ this.getLessons }
        >
          { this.state.loggedIn ? // If you are logged in allow all routes
         (<Switch>
            <Route exact path='/'
              render={() => (
                <div>
                  <Carousel interval="4000">
                    <Carousel.Item>
                        <div className="background"></div>
                      <Carousel.Caption className="captions1">
                        <h1>Simplify.</h1>
                        <h4>Make learning simple.</h4>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item >
                        <div className="background2"></div>
                      <Carousel.Caption className="captions2">
                        <h1>Organize.</h1>
                        <h4>Create lessons with videos, articles, text and more.</h4>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item >
                        <div className="background3"></div>
                      <Carousel.Caption className="captions3">
                        <h1>Collaborate.</h1>
                        <h4>Find your network. Join open discussions on each lesson.</h4>
                      </Carousel.Caption>
                    </Carousel.Item>

                    <Carousel.Item >
                        <div className="background4"></div>
                      <Carousel.Caption className="captions4">
                        <h1>Connect.</h1>
                        <h4>Skip the classrooms, introducing a real-time chat system</h4>
                      </Carousel.Caption>
                    </Carousel.Item>

                    </Carousel>
                  <LessonPreviewContainer
                    lessons= { this.state.lessons }
                    organizeSearchResultsBasedOnMostLikes={ this.organizeSearchResultsBasedOnMostLikes }
                    sortByViews={this.sortByViews}
                    getLessons={ this.getLessons }
                  /> 
                </div>
              )}
            />
            <Route path='/lesson/:id'
              // component={ LessonPage }
              component={ Lesson }
            />
            <Route path='/create'
              render={ () => (
                <LessonCreator
                  username={this.state.user.username}
                  userRef={this.state.user._id}
                />
              )}
            />
            <Route path='/user' render={ () =>
                <User
                  user={ this.state.user }
                  getLessons={ this.getLessons }
                />
              }
            />
            <Route path='/notification' render={ () =>
                <Notification
                  user={ this.state.user }
                  getLessons={ this.getLessons }
                />
              }
            />
            <Route path='/logout' render={ () => (
              <Logout logout={ this.logout }/>
            )}
            />
          </Switch>) : // if not, everything goes to the login component
          (<Switch>
              <Route path='*' render={ () =>
                <Login
                  login={ this.login }
                  displayLogginError={ this.state.displayLogginError }
                  createAccount={ this.createAccount }
                />
              }/>
            </Switch>)
            }
        </App>
      </BrowserRouter>
    );
  }
}

export default RouterWrapper;
