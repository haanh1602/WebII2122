import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';
import AuthService from "../services/auth.service";

const API_URL = config.apiUrl;

class InspectionService {
    getInspections() {
        return axios.get(API_URL + 'inspectionplan/', { headers: authHeader() });
    }

    getInspectionInfo(inspectionplanId) {
        return axios.get(API_URL + 'inspectionplan/' + inspectionplanId + "/", { headers: authHeader() });
    }

    createInspection(data) {
        return axios.post(API_URL + 'inspectionplan/', data, { headers: authHeader() });
    }

    updateInspection(data, id) {
        return axios.patch(API_URL + 'inspectionplan/' + id + "/", data , { headers: authHeader() });
    }

    deleteInspection(inspectionplanId) {
        return axios.delete(API_URL + 'inspectionplan/' + inspectionplanId + "/", { headers: authHeader() });
    }

    auth() {
        var user = AuthService.getCurrentUser();
        if (!user) return null;
        var auth = {
            view: true,
            edit: true,
            delete: user.is_manager,
            create: user.is_manager,
            displayAction: true
        }
        return auth;
      }
}

export default new InspectionService();
