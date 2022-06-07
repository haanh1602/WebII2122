import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';
import AuthService from "./auth.service";

const API_URL = config.apiUrl;

class SampleService {
    getSamples() {
        return axios.get(API_URL + 'sample/', { headers: authHeader() });
    }

    getSampleInfo(sampleId) {
        return axios.get(API_URL + 'sample/' + sampleId + "/", { headers: authHeader() });
    }

    createSample(data) {
        console.log(data);
        return axios.post(API_URL + 'sample/', data, { headers: authHeader() });
    }

    updateSample(data, id) {
        return axios.patch(API_URL + 'sample/' + id + '/', data, { headers: authHeader() });
    }

    deleteSample(sampleId) {
        return axios.delete(API_URL + 'sample/' + sampleId + "/", { headers: authHeader() });
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

export default new SampleService();
