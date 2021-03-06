import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import AuthService from "./services/auth.service";
import UserService from "./services/user.service";
import AreaService from "./services/area.service";
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

import MyDatePicker from "./components/date-picker.component";

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
      navSelected: "",
      startDate: new Date()
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
            B??? y t???<br/>C???c an to??n v??? sinh th???c ph???m
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              {AreaService.idToArea(currentUser.id_area) && (<div className="nav-item" style={{padding: '8px', color: 'yellow', marginRight: '30px'}}>
                <div style={{color: 'white'}}>Khu v???c qu???n l??</div>
                {currentUser.is_manager? AreaService.idToQuan(currentUser.id_area).name_with_type : AreaService.idToPhuong(currentUser.id_area).name_with_type}
              </div>)
              }
              <li className={"nav-item" + this.selectedNav("profile")}>
                <Link to={"/profile"} className="nav-link"  onClick={() => this.setState({navSelected: "profile"})}>
                  {currentUser.first_name} {currentUser.last_name}
                  <div style={{color: "yellow"}}>{currentUser.is_manager? "Qu???n l??" : "Chuy??n vi??n"}</div>
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  ????ng xu???t
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  ????ng nh???p
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
                  Trang ch???
                </Link>
              </li> 
            )}   

            {currentUser && currentUser.is_manager &&(
              <li className={"nav-item" + this.selectedNav("user")}>
                <Link to={"/user"} className="nav-link" onClick={() => this.setState({navSelected: "user"})}>
                  Qu???n l?? t??i kho???n
                </Link>
              </li>
            )}

            {currentUser && (
              <li className={"nav-item" + this.selectedNav("premises")}>
                <Link to={"/premises"} className="nav-link" onClick={() => this.setState({navSelected: "premises"})}>
                  C?? s???
                </Link>
              </li>
            )}

            {currentUser && (
              <li className={"nav-item" + this.selectedNav("inspection")}>
                <Link to={"/inspection"} className="nav-link" onClick={() => this.setState({navSelected: "inspection"})}>
                K??? ho???ch thanh tra
                </Link>
              </li>
            )}

            {currentUser && currentUser.is_manager &&(
              <li className={"nav-item" + this.selectedNav("certificate")}>
                <Link to={"/certificate"} className="nav-link" onClick={() => this.setState({navSelected: "certificate"})}>
                Ch???ng nh???n
                </Link>
              </li>
            )}

            {currentUser && (
              <li className={"nav-item" + this.selectedNav("sample")}>
                <Link to={"/sample"} className="nav-link" onClick={() => this.setState({navSelected: "sample"})}>
                M???u thanh tra
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
      </div>
    );
  }
}

export default App;
