import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';
import AuthService from "../services/auth.service";

const API_URL = config.apiUrl;

class PremisesService {
    getPremises() {
        return axios.get(API_URL + 'premises/', { headers: authHeader() });
    }

    getPremiseInfo(premiseId) {
        return axios.get(API_URL + 'premises/' + premiseId + "/", { headers: authHeader() });
    }

    createPremise(data) {
        
        return axios.post(API_URL + 'premises/', data, { headers: authHeader() });
    }

    updatePremise(data) {
        console.log(data);
        return axios.put(API_URL + 'premises/' + data.id + "/", data, { headers: authHeader() });
    }

    deletePremise(premiseId) {
        return axios.delete(API_URL + 'premises/' + premiseId + "/", { headers: authHeader() });
    }

    auth() {
        var user = AuthService.getCurrentUser();
        if (!user) return null;
        var auth = {
            view: true,
            edit: user.is_manager,
            delete: user.is_manager,
            create: user.is_manager,
            displayAction: user.is_manager
        }
        return auth;
    }
}

export default new PremisesService();
