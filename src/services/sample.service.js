import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class SampleService {
    getSamples() {
        return axios.get(API_URL + 'sample').then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    getSampleInfo(sampleId) {
        return axios.get(API_URL + 'sample/' + sampleId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    createSample(data) {
        return axios.post(API_URL + 'sample', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    updateSample(data) {
        return axios.patch(API_URL + 'sample', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    deleteSample(sampleId) {
        return axios.delete(API_URL + 'sample/' + sampleId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }
}

export default new SampleService();
