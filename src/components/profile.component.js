import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" },
      currenUserInfo: {}
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    const currentUserInfo = UserService.getUserInfo(currentUser.username);
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
    this.setState({currentUserInfo: currentUserInfo});
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser, currentUserInfo } = this.state;

    return (
      <div className="container">
        {(this.state.userReady) ?
        <div>
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Token:</strong>{" "}
          {currentUser.access.substring(0, 20)} ...{" "}
          {currentUser.access.substr(currentUser.access.length - 20)}
        </p>
        <p>
          <strong>Id:</strong>{" "}
          {currentUserInfo.id}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {currentUserInfo.email}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </div>: null}
      </div>
    );
  }
}
