import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';
import AuthService from "./auth.service";

const API_URL = config.apiUrl;
const validDic = [{name: "Hợp lệ", id: true}, {name: "Không hợp lệ", id: false}];

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
            displayAction: false
        }
        return auth;
    }

    idToName(id) {
        return validDic.find(i => i.id == id)? validDic.find(i => i.id == id).name : null;
    }

    nameToId(name) {
        return validDic.find(i => i.name == name)? validDic.find(i => i.name == name).id : null;
    }
}

export default new SampleService();
