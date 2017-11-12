import React from 'react';
import { Button } from 'react-bootstrap';
import { io } from '../../public/api.js';
import axios from 'axios';
import ToggleDisplay from 'react-toggle-display';

class Chat extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      newMessage: "",
      chat:this.props.lesson.chat,
      show: false
    }
    console.log(this);
    this.setState({
      chat: this.props.lesson.chat
    })
    this.changeHandler = this.changeHandler.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.renderChat = this.renderChat.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleHideClick2 = this.handleHideClick2.bind(this);
    io.updateChat((data) => {
      this.setState({
        chat: data.chat
      })
    });
  }

  componentDidMount() {
    axios.get('/currentUser')
      .then((res) => {
        this.setState({
          username: res.data
        })
      })
    var lesson = {
      lesson: this.props.lesson,
    }
    io.renderChat(lesson)
    // this.renderChat();

    // this.setState({
    //   chat: this.props.lesson.chat
    // })
  }

  renderChat() {
    console.log(this.props);

    this.setState({
      chat: this.props.lesson.chat
    })
  }

  sendMessage(e) {
    e.preventDefault();
    var newMessage = {
      newMessage: this.state.newMessage,
      lesson: this.props.lesson,
      username: this.state.username
    }
    io.sendMessage(newMessage);
    this.setState({
      newMessage: ""
    })

  }

  changeHandler(e) {
    e.preventDefault();
    var name = e.target.name;
    var val = e.target.value;
    this.setState({
      [name]: val
    })
  }

  handleHideClick() {
    this.renderChat();
    this.setState({
      show: !this.state.show
    });
    this.scrollToBottom();
    var lesson = {
      lesson: this.props.lesson,
    }
    io.renderChat(lesson)
  }

  handleHideClick2() {
    this.setState({
      show: !this.state.show
    });
  }

  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }


  render() {
    const chatLines = this.state.chat.map((chatLine, i) => {
      return (
          <div key={i + JSON.stringify(chatLine.message)} className="chatLine">
            <h5> {chatLine.username} </h5>
            <p> {chatLine.message} </p>
          </div>
        )
    })
    const componentClasses = ['chat'];
    if  (this.state.show) { componentClasses.push('show'); console.log('pushing component class') }
    return (

    <div>
      <ToggleDisplay show={this.state.show}>
        <div className={componentClasses.join(' ')}>
          <div className="chatHead">
            <h5 onClick={this.handleHideClick2}> Chat </h5>
          </div>
          <div className="displayChat"> 
            <div>
              {chatLines}
              <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </div>
          </div>

          <input className="chatInput" name="newMessage" value={this.state.newMessage} onChange={this.changeHandler}/>
          <button onClick={this.sendMessage}> Send </button>
        </div>
      </ToggleDisplay>
      <ToggleDisplay show={!this.state.show}>
        <div onClick={this.handleHideClick} className="chatHide">
          <h5> Chat </h5>
        </div>
      </ToggleDisplay>
    </div>
    );
  }
}


export default Chat;