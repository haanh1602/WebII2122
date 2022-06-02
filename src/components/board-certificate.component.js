import React, { Component } from "react";

import CertificateService from "../services/certificate.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

export default class Certificate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentWillMount() {
    if (!AuthService.getCurrentUser())  window.location.href = "/login";
  }

  componentDidMount() {
    CertificateService.getCertificates().then(
      response => {
        this.setState({
          content: response.statusText
        });
        this.setState({
          data: response.data
        });
        console.log(response);
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        // if (error.response && error.response.status === 401) {
        //   EventBus.dispatch("logout");
        // }
      }
    );
  }

  renderContent() {
    // return this.state.data.map((user, index) => {
    //   const {email, first_name, groups, id_area, is_manager, last_name, username} = user;
    //   return (
    //     is_manager? <p key={username}>Email: {email}, Name: {first_name} {last_name}, Area: {id_area}, Username: {username}</p> : null
    //   );
    // });
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
      </div>
    );
  }
}
