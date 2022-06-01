import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class InspectionService {
    getInspections() {
        return axios.get(API_URL + 'inspectionplan').then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    getInspectionInfo(inspectionplanId) {
        return axios.get(API_URL + 'inspectionplan/' + inspectionplanId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    createInspection(data) {
        return axios.post(API_URL + 'inspectionplan', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    updateInspection(data) {
        return axios.patch(API_URL + 'inspectionplan', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    deleteInspection(inspectionplanId) {
        return axios.delete(API_URL + 'inspectionplan/' + inspectionplanId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }
}

export default new InspectionService();
