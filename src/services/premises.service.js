import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class PremisesService {
    getPremises() {
        return axios.get(API_URL + 'premises/', { headers: authHeader() });
    }

    getPremiseInfo(premiseId) {
        return axios.get(API_URL + 'premises/' + premiseId + "/", { headers: authHeader() });
    }

    createPremise(data) {
        return axios.post(API_URL + 'premises/', data + "/", { headers: authHeader() });
    }

    updatePremise(data) {
        return axios.patch(API_URL + 'premises/', data + "/", { headers: authHeader() });
    }

    deletePremise(premiseId) {
        return axios.delete(API_URL + 'premises/' + premiseId + "/", { headers: authHeader() });
    }
}

export default new PremisesService();
