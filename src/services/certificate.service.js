import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class CertificateService {
    getCertificates() {
        return axios.get(API_URL + 'certificate/', { headers: authHeader() });
    }

    getCertificateInfo(certificateId) {
        return axios.get(API_URL + 'certificate/' + certificateId + "/", { headers: authHeader() });
    }

    createCertificate(data) {
        return axios.post(API_URL + 'certificate/', data + "/", { headers: authHeader() });
    }

    updateCertificate(data) {
        return axios.patch(API_URL + 'certificate/', data + "/", { headers: authHeader() });
    }

    deleteCertificate(certificateId) {
        return axios.delete(API_URL + 'certificate/' + certificateId + "/", { headers: authHeader() });
    }
}

export default new CertificateService();
