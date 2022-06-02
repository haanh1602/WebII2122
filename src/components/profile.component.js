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
    const currentUserInfo = UserService.getUserInfo(currentUser.username).then((response) => {
      this.setState({ currentUserInfo: response.data });
      const user = JSON.parse(localStorage.getItem('user'));  
      const userInfo = {
        access: user.access,
        refresh: user.refresh,
        username: response.data.username,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        id_area: response.data.id_area,
        is_manager: response.data.is_manager,
        groups: response.data.groups,
      }
      localStorage.setItem('user', JSON.stringify(userInfo));
      return response;
    });
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true })
    this.setState({ currentUserInfo: currentUserInfo});
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
            <strong>{currentUserInfo.first_name} {currentUserInfo.last_name}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Username:</strong>{" "}
          {currentUserInfo.username}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {currentUserInfo.email}
        </p>
        <p>
        <strong>Position:</strong>
          {currentUserInfo.is_manager? " Manager" : " Expert"}
        </p>
        <p>
        <strong>Area:</strong>{" "}
          {currentUserInfo.id_area}
        </p>
      </div>: null}
      </div>
    );
  }
}
