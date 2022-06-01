import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;

class CertificateService {
    getCertificates() {
        return axios.get(API_URL + 'certificate').then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    getCertificateInfo(certificateId) {
        return axios.get(API_URL + 'certificate/' + certificateId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    createCertificate(data) {
        return axios.post(API_URL + 'certificate', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    updateCertificate(data) {
        return axios.patch(API_URL + 'certificate', data).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }

    deleteCertificate(certificateId) {
        return axios.delete(API_URL + 'certificate/' + certificateId).then((response) => {
            console.log(response);
            return response;
        }).catch((error) => {
            console.log(error);
        })
    }
}

export default new CertificateService();
