import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';
import AuthService from "../services/auth.service";

const API_URL = config.apiUrl;

class CertificateService {
    getCertificates() {
        return axios.get(API_URL + 'certificate/', { headers: authHeader() });
    }

    getCertificateInfo(certificateId) {
        return axios.get(API_URL + 'certificate/' + certificateId + "/", { headers: authHeader() });
    }

    createCertificate(data) {
        return axios.post(API_URL + 'certificate/', data, { headers: authHeader() });
    }

    updateCertificate(data, id) {
        return axios.patch(API_URL + 'certificate/' + id + "/", data, { headers: authHeader() });
    }

    deleteCertificate(certificateId) {
        return axios.delete(API_URL + 'certificate/' + certificateId + "/", { headers: authHeader() });
    }

    auth() {
        var user = AuthService.getCurrentUser();
        if (!user) return null;
        var auth = {
            view: true,
            edit: user.is_manager,
            delete: user.is_manager,
            create: user.is_manager,
            displayAction: true
        }
        return auth;
    }
}

export default new CertificateService();
