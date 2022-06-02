import axios from "axios";
import config from './../config.json';
import UserService from './user.service';

const API_URL = config.apiUrl;

class AuthService {
  login(username, password) {
    console.log(username, password);
    return axios
      .post(API_URL + "token/", {
        username,
        password
      })
      .then(response => {
        if (response.data.access) {
          const user = {
            access: response.data.access,
            refresh: response.data.refresh,
            username: username
          };
          localStorage.setItem('user', JSON.stringify(user));
        }
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    console.log(username, email, password);
    return axios.post(API_URL + "users/", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
