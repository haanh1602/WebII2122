import React, { Component } from "react";

import UserService from "../services/user.service";
import AuthService from "../services/auth.service";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
  }

  componentDidMount() {
    UserService.getUsers().then(
      response => {
        this.setState({
          content: response.data.detail
        });
      },
      error => {
        this.setState({
          content: error.response.data.detail
            // (error.response && error.response.data) ||
            // error.message ||
            // error.toString()
        });
        window.location.href = "/login";
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          {!AuthService.getCurrentUser? <h3>{this.state.content}</h3> 
          : <div>Hello {AuthService.getCurrentUser().first_name}!</div>}

        </header>
      </div>
    );
  }
}
