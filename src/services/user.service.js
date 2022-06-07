import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

import AuthService from './auth.service';

const API_URL = config.apiUrl;

class UserService {
  getUsers() {
    return axios.get(API_URL + 'users/', { headers: authHeader() });
  }

  createUser(data) { 
    return axios.post(API_URL + 'users/', data, { headers: authHeader() });
  }

  updateUser(data) {
      return axios.patch(API_URL + 'users/' + data.username + "/", data, { headers: authHeader() });
  }

  deleteUser(username) {
      return axios.delete(API_URL + 'users/' + username + "/", { headers: authHeader() });
  }

  getUserInfo(username) {
    return axios.get(API_URL + "users/" + username + "/", { headers: authHeader() });
  }

  auth() {
    var user = AuthService.getCurrentUser();
    if (!user) return null;
    var auth = {
        view: user.is_manager,
        edit: user.is_manager,
        delete: user.is_manager,
        create: user.is_manager,
        displayAction: user.is_manager
    }
    return auth;
  }
}

export default new UserService();
