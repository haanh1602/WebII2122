import React, {useState, useEffect} from 'react';
import axios from 'axios';
import config from './../config.json';
import '../css/login.css';
import Logo from './Logo.js'

export default function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameNotice, setUsernameNotice] = useState('.');
    const [passwordNotice, setPasswordNotice] = useState('.');

    const onSubmitClick = () => {
        const param = new URLSearchParams();
        param.append('username', username);
        param.append('password', password);
        axios.post(config.apiUrl + '/token', param, config.config)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const display = (status, type) => {
        if (status == '.') return "hidden";
        return type + " danger";
    }

    return (
        <div className="container">
            <div className="login">
                <Logo style="flex4"/>
                <div className="form">
                    <br/>
                    <div className="title">
                        Đăng nhập
                    </div>
                    <br/>
                    <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <span className={display(usernameNotice, "block")}>{usernameNotice}</span>
                    <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <span className={display(passwordNotice, "block")}>{passwordNotice}</span>
                    <input type="submit" className="submit" value = "ĐĂNG NHẬP" onClick = {onSubmitClick}/>
                    <div className="regis-text">Chưa có tài khoản? <a href="/register" className="link">Đăng ký ngay</a></div>
                </div>
            </div>
        </div>
    );
}