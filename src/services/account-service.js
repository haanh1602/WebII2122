import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class AccountService {
    getAccounts() {
        return axios.get(API_URL + 'users/', { headers: authHeader() });
    }

    getAreaInfo(areaId) {
        return axios.get(API_URL + 'area/' + areaId + "/", { headers: authHeader() });
    }

    createArea(data) {
        console.log(data);
        return axios.post(API_URL + 'area/', data + "/", { headers: authHeader() });
    }

    updateArea(data) {
        return axios.patch(API_URL + 'area/', data + "/", { headers: authHeader() });
    }

    deleteArea(areaId) {
        return axios.delete(API_URL + 'area/' + areaId + "/", { headers: authHeader() });
    }
}

export default new AreaService();
