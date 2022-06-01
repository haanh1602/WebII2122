import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class PremisesService {
    getPremises() {
        return axios.get(API_URL + 'premises').then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    getPremiseInfo(premiseId) {
        return axios.get(API_URL + 'premises/' + premiseId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    createPremise(data) {
        return axios.post(API_URL + 'premises', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    updatePremise(data) {
        return axios.patch(API_URL + 'premises', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    deletePremise(premiseId) {
        return axios.delete(API_URL + 'premises/' + premiseId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }
}

export default new PremisesService();
