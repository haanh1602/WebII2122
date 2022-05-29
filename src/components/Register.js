import React, {useState, useEffect} from 'react';
//import './../css/bootstrap.css';
import axios from 'axios';
import config from './../config.json';
import Logo from './Logo.js';
import './../css/login.css';

export default function Register(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameNotice, setUsernameNotice] = useState('.');
    const [passwordNotice, setPasswordNotice] = useState('.');
    const [confirmPasswordNotice, setConfirmPasswordNotice] = useState('.');

    const onSubmitClick = () => {
        if (!/[A-Za-z0-9]/.test(username)) {
            setUsernameNotice('Tên đăng nhập chứa ký tự đặc biệt'); return;
        } else setUsernameNotice('.');
        if (username === password) {
            setPasswordNotice('Mật khẩu không được trùng với tên đăng nhập'); return;
        } else setPasswordNotice('.');
        sendRegistration();
    }

    const sendRegistration = () => {
        const param = new URLSearchParams();
        param.append('username', username);
        param.append('password', password);
        const url = config.apiUrl + '/users';
        window.alert(url);
        axios.post(url, param, config.config)
            .then((res) => {
                window.open("/login");
            })
            .catch((err) => {
                console.log(err);
            });
            window.open("/login");
    }

    const checkConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
        if (event.target.value != password) {
            setConfirmPasswordNotice("Mật khẩu không khớp");
        } else {
            setConfirmPasswordNotice(".");
        }
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
                    <div className="title">
                        Đăng ký
                    </div>
                    <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <span className={display(usernameNotice, "block")}>{usernameNotice}</span>
                    <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <span className={display(passwordNotice, "block")}>{passwordNotice}</span>
                    <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => checkConfirmPassword(e)} />
                    <span className={display(confirmPasswordNotice, "block")}>{confirmPasswordNotice}</span>
                    <input type="submit" className="submit" value = "ĐĂNG KÝ" onClick = {onSubmitClick}/>
                    <div className="regis-text">Đã có tài khoản? <a href="/login">Đăng nhập</a></div>
                </div>
            </div>
        </div>
    );
}