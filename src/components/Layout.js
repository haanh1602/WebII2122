import React, {useState, useEffect} from 'react';
import Home from "./Home.js";
import Login from "./Login.js";
import Register from "./Register.js";
import { BrowserRouter, Route, Routes} from "react-router-dom";

export default function Layout(props) {

    const [path, setPath] = useState("/");

    return (
        <BrowserRouter> 
            <Routes>
                <Route path = "/login" element={<Login/>}></Route>
                <Route path = "/register" element={<Register/>}></Route>
                <Route path = "/" element={<Home/>}></Route>
            </Routes>
        </BrowserRouter>
    );
}