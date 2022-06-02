import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class SampleService {
    getSamples() {
        return axios.get(API_URL + 'sample/', { headers: authHeader() });
    }

    getSampleInfo(sampleId) {
        return axios.get(API_URL + 'sample/' + sampleId + "/", { headers: authHeader() });
    }

    createSample(data) {
        return axios.post(API_URL + 'sample/', data + "/", { headers: authHeader() });
    }

    updateSample(data) {
        return axios.patch(API_URL + 'sample/', data + "/", { headers: authHeader() });
    }

    deleteSample(sampleId) {
        return axios.delete(API_URL + 'sample/' + sampleId + "/", { headers: authHeader() });
    }
}

export default new SampleService();
