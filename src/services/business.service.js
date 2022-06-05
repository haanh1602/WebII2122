import axios from 'axios';
import authHeader from './auth-header';
import config from './../config.json';

const API_URL = config.apiUrl;
const business = [{name: "Sản xuất thực phẩm", id: 1},{name: "Dịch vụ ăn uống" , id: 2}];

class BusinessService {
    getBusiness(id) {
        return business.find((b) => b.id == id).name;
    }
}

export default new BusinessService();
