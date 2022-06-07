import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;
const quan = require('hanhchinhvn/dist/quan_huyen.json');
const phuong = require('hanhchinhvn/dist/xa_phuong.json');

class AreaService {
    getAreas() {
        return axios.get(API_URL + 'area/', { headers: authHeader() });
    }

    getAreaInfo(areaId) {
        return axios.get(API_URL + 'area/' + areaId + "/", { headers: authHeader() });
    }

    createArea(data) {
        return axios.post(API_URL + 'area/', data + "/", { headers: authHeader() });
    }

    updateArea(data) {
        return axios.patch(API_URL + 'area/', data + "/", { headers: authHeader() });
    }

    deleteArea(areaId) {
        return axios.delete(API_URL + 'area/' + areaId + "/", { headers: authHeader() });
    }

    getQuan() {
        var res = [];
        var length = 100000;
        for (var i = 1*100000; i < length*100000; i+=100000) {
            const e = quan[this.normalizeQuan(i)];
            if (e) res.push(e);
        }
       // console.log(res);
        return res.filter(q => q.parent_code == "01");
    }

    getPhuong(areaId) {
        var res = [];
        var length = 32248;
        for (var i = 1; i <= length; i++) {
            const e = phuong[this.normalizePhuong(i)];
            if (e && !res.includes(e)) res.push(e);
        }
        //console.log(res);
        //console.log(this.normalizeQuan(areaId));
        return res.filter(q => q.parent_code == this.normalizeQuan(areaId)).sort((q1, q2) => q1.name - q2.name);
    }

    normalizeQuan(areaId) {
        var areaIdH= parseInt(areaId / 100000);
        var areaIdStr = areaIdH.toString();
        var length = 3;
        for (var i = 0; i < length && areaIdStr.length < length; i++) {
            areaIdStr = "0" + areaIdStr;
        }
        //console.log(areaIdStr);
        return areaIdStr;
    }

    idToQuan(areaId) {
        return quan[this.normalizeQuan(areaId)];
    }

    normalizePhuong(areaId) {
        var areaIdH = parseInt(areaId % 100000);
        var areaIdStr = areaIdH.toString();
        var length = 5;
        for (var i = 0; i < length && areaIdStr.length < length; i++) {
            areaIdStr = "0" + areaIdStr;
        }
        return areaIdStr;
    }

    idToPhuong(areaId) {
        return phuong[this.normalizePhuong(areaId)];
    }

    idToArea(areaId) {
        if (!this.idToPhuong(areaId) || !this.idToQuan(areaId)) {
            return "";
        }
        return this.idToPhuong(areaId).name_with_type + ", " + this.idToQuan(areaId).name_with_type;
    }

    areaId(quanId, phuongId) {
        return parseInt(quanId)*100000 + parseInt(phuongId);
    }
}

export default new AreaService();
