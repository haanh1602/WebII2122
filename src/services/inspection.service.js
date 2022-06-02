import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class InspectionService {
    getInspections() {
        return axios.get(API_URL + 'inspectionplan/', { headers: authHeader() });
    }

    getInspectionInfo(inspectionplanId) {
        return axios.get(API_URL + 'inspectionplan/' + inspectionplanId + "/", { headers: authHeader() });
    }

    createInspection(data) {
        return axios.post(API_URL + 'inspectionplan/', data + "/", { headers: authHeader() });
    }

    updateInspection(data) {
        return axios.patch(API_URL + 'inspectionplan/', data + "/", { headers: authHeader() });
    }

    deleteInspection(inspectionplanId) {
        return axios.delete(API_URL + 'inspectionplan/' + inspectionplanId + "/", { headers: authHeader() });
    }
}

export default new InspectionService();
