import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        Không được để trống!
      </div>
    );
  }
};

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: "",
      userReady: false,
      gettingUser: false,
    };
  }

  componentDidMount() {
    if (AuthService.getCurrentUser()) window.location.href = "/home";
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        (response) => {
          console.log(response);
          if (response.response && response.response.status === 401) {
            const resMessage = "Tên đăng nhập hoặc mật khẩu không hợp lệ!";
            this.setState({message: resMessage})
            this.setState({
              loading: false,
            });
          }
          else {
            const resMessage = "";
            this.setState({message: resMessage})
            this.setState({gettingUser: true});
          }
          
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    if (this.state.gettingUser) {
      this.setState({gettingUser: false});
      const user = JSON.parse(localStorage.getItem('user')); 
      UserService.getUserInfo(user.username).then((response) => {
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
        this.setState({userReady: true});
      }).catch((err) => {
        console.log(err);
      })
    }
    if (this.state.userReady && !this.state.gettingUser) {
      this.setState({userReady: false});
      this.props.history.push("/profile");
      window.location.reload();
    }
    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleLogin}
            ref={c => {
              this.form = c;
            }}
          >
            <div className="form-group">
              <label htmlFor="username">Tài khoản</label>
              <Input
                type="text"
                className="form-control"
                name="username"
                value={this.state.username}
                onChange={this.onChangeUsername}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button
                className="btn btn-primary btn-block"
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Đăng nhập</span>
              </button>
            </div>

            {this.state.message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
