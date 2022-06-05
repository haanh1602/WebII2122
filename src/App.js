import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import AuthService from "./services/auth.service";
import UserService from "./services/user.service";
import config from "./config.json";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import BoardUser from "./components/board-user.component";
import Premises from "./components/board-premises.component";
import Inspection from "./components/board-inspection.component";
import Certificate from "./components/board-certificate.component";
import Sample from "./components/board-sample.component";

// import AuthVerify from "./common/auth-verify";
import EventBus from "./common/EventBus";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      navSelected: ""
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user,
      });
    }
    
    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    this.setState({
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    });
  }

  selectedNav = (navName) => {
    return this.state.navSelected == navName ? " selected" : "";
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;
    return (
      <div className="background">
        <nav className="navbar navbar-expand nav-top">
          <Link to={"/"} className="navbar-brand" onClick={() => this.setState({navSelected: ""})}>
            <img src={config.logoUrl} alt="logo" width="80" height="80" />
          </Link>
          <div className ="top-font">
            Bộ y tế<br/>Cục an toàn vệ sinh thực phẩm
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className={"nav-item" + this.selectedNav("profile")}>
                <Link to={"/profile"} className="nav-link"  onClick={() => this.setState({navSelected: "profile"})}>
                  {currentUser.first_name} {currentUser.last_name}
                  <div style={{color: "yellow", fontSize: "12px"}}>{currentUser.is_manager? "Quản lý" : "Chuyên viên"}</div>
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  Đăng xuất
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Đăng nhập
                </Link>
              </li>
            </div>
          )}
        </nav>
        {currentUser && (
        <nav className="navbar navbar-expand nav-bellow">
          <div className="navbar-nav mr-auto">
            {currentUser && (
              <li className={"nav-item" + this.selectedNav("home")}>
                <Link to={"/home"} className="nav-link" onClick={() => this.setState({navSelected: "home"})}>
                  Trang chủ
                </Link>
              </li> 
            )}   

            {currentUser && currentUser.is_manager &&(
              <li className={"nav-item" + this.selectedNav("user")}>
                <Link to={"/user"} className="nav-link" onClick={() => this.setState({navSelected: "user"})}>
                  Quản lý tài khoản
                </Link>
              </li>
            )}

            {currentUser && (
              <li className={"nav-item" + this.selectedNav("premises")}>
                <Link to={"/premises"} className="nav-link" onClick={() => this.setState({navSelected: "premises"})}>
                  Cơ sở
                </Link>
              </li>
            )}

            {currentUser && (
              <li className={"nav-item" + this.selectedNav("inspection")}>
                <Link to={"/inspection"} className="nav-link" onClick={() => this.setState({navSelected: "inspection"})}>
                Kế hoạch thanh tra
                </Link>
              </li>
            )}

            {currentUser && currentUser.is_manager &&(
              <li className={"nav-item" + this.selectedNav("certificate")}>
                <Link to={"/certificate"} className="nav-link" onClick={() => this.setState({navSelected: "certificate"})}>
                Chứng nhận
                </Link>
              </li>
            )}

            {currentUser && (
              <li className={"nav-item" + this.selectedNav("sample")}>
                <Link to={"/sample"} className="nav-link" onClick={() => this.setState({navSelected: "sample"})}>
                Mẫu thanh tra
                </Link>
              </li>
            )}

          </div>
        </nav>
        )}
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/user" component={BoardUser} />
            <Route path="/premises" component={Premises} />
            <Route path="/inspection" component={Inspection} />
            <Route path="/certificate" component={Certificate} />
            <Route path="/sample" component={Sample} />
            <Route path="/" component={Home} />
          </Switch>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */ }
      </div>
    );
  }
}

export default App;
