import React, {useState, useEffect} from 'react';
//import './../css/bootstrap.css';
import axios from 'axios';
import config from './../config.json';
import Logo from './Logo.js';
import './../css/login.css';
import qs from 'qs';

export default function Register(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameNotice, setUsernameNotice] = useState('.');
    const [passwordNotice, setPasswordNotice] = useState('.');
    const [confirmPasswordNotice, setConfirmPasswordNotice] = useState('.');

    const onSubmitClick = () => {
        var valid = checkUsername(username) + checkPassword(password);
        if (valid < 1) sendRegistration();
    }

    const checkUsername = (username) => {
        let usernameLength = username.length;
        if (usernameLength < 4){
            setUsernameNotice('Tên đăng nhập phải chứa ít nhất 4 ký tự'); return 1;
        } else if (!/[A-Za-z0-9]/.test(username)) {
            setUsernameNotice('Tên đăng nhập không được chứa ký tự đặc biệt'); return 1;
        } else setUsernameNotice('.');
        return 0;
    }

    const checkPassword = (password) => {
        let passwordLength = password.length;
        if (passwordLength < 6) {
            setPasswordNotice('Mật khẩu phải chứa ít nhất 6 ký tự'); return 1;
        } else setPasswordNotice('.');
        if (username === password) {
            setPasswordNotice('Mật khẩu không được trùng với tên đăng nhập'); return 1;
        } else setPasswordNotice('.');
        return 0;
    }

    const sendRegistration = () => {
        const param = new URLSearchParams();
        param.append('username', username);
        param.append('password', password);
        param.append('password2', password);
        param.append('first_name', "An");
        param.append('last_name', "Le");
        param.append('role', "MN");
        param.append('id_area', "1");
        param.append('email', "lean68011@gmail.com");
        const url = config.apiUrl + '/users/';
        // console.log(param);
        axios.post(url, param, config.config)
        .then((res) => {
            window.location.href = '/login';
            console.log("?| " + res);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const postReq = (details, url) => {
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: formBody
        })        
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
                    <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => {setUsername(e.target.value); checkUsername(e.target.value)}}/>
                    <span className={display(usernameNotice, "block")}>{usernameNotice}</span>
                    <input type="password" placeholder="Mật khẩu" value={password} onChange={(e) => {setPassword(e.target.value); checkPassword(e.target.value)}}/>
                    <span className={display(passwordNotice, "block")}>{passwordNotice}</span>
                    <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => checkConfirmPassword(e)} />
                    <span className={display(confirmPasswordNotice, "block")}>{confirmPasswordNotice}</span>
                    <input type="submit" className="submit" value = "ĐĂNG KÝ" onClick = {onSubmitClick}/>
                    <div className="regis-text">Đã có tài khoản? <a href="/login" className="link">Đăng nhập</a></div>
                </div>
            </div>
        </div>
    );
}