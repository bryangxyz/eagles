import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
      <div className="navHolder">
        <NavBar
          history= { this.props.history }
          queryDataBaseWithSearchInput={this.props.queryDataBaseWithSearchInput}
          logout={ this.props.logout }
          getLessons={ this.props.getLessons }
        />
      </div>
        { this.props.children || 'no children!' }
        </div>
    );
  }
}



export default withRouter(App);
