import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';
import AuthService from "../services/auth.service";

const API_URL = config.apiUrl;
const statusDic = [{name: "Đang xử lý", id: 'xuly'},{name: "Cấp giấy" , id: 'capgiay'}, {name: "Thu hồi", id: 'thuhoi'}, {name: "Đạt chuẩn", id: 'datchuan'}, {name: "Không đạt chuẩn", id: 'khongdatchuan'}];

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
            displayAction: true,
        }
        return auth;
    }

    idToName(status) {
        return statusDic.find(s => s.id === status)? statusDic.find(s => s.id == status).name : null;
    }

    nameToId(name) {
        return statusDic.find(s => s.name == name)? statusDic.find(s => s.name == name).id : null;
    }
}

export default new InspectionService();
