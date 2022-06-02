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
          localStorage.setItem("user", JSON.stringify(user));
          UserService.getUserInfo(user.username).then(response => {
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
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(userInfo));
          });
        }
        return response.data;
      })
      .catch((error) => {
        console.log(error);
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
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
