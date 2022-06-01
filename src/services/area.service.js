import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class AreaService {
    getAreas() {
        return axios.get(API_URL + 'area').then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    getAreaInfo(areaId) {
        return axios.get(API_URL + 'area/' + areaId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    createArea(data) {
        return axios.post(API_URL + 'area', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    updateArea(data) {
        return axios.patch(API_URL + 'area', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    deleteArea(areaId) {
        return axios.delete(API_URL + 'area/' + areaId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }
}

export default new AreaService();
