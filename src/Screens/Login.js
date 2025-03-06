import React from 'react';
import "../style/Login.css";
import qr from "../images/output-onlinejpgtools.png";
import { PiUserFill, PiLockKeyFill ,PiEye , PiEyeSlash  } from "react-icons/pi";
import { useEffect, useState, useContext } from "react";
import UserContext from "../store/user-context";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "../Constants/RoutePath";


const Login = (props) => {

    const uctx = useContext(UserContext);
    const navigate = useNavigate();
    const [passwordFocussed, setPasswordFocussed] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState("");
    const [usernameFocussed, setUsernameFocussed] = useState(false);
    const [username, setUsername] = useState("");
    const [loginInvalid, setLoginInvalid] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                onLogin();
            }
        };
    
        document.addEventListener('keypress', handleKeyPress);
    
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        };
        // eslint-disable-next-line
    }, [username, password]);

    const onLogin = async () => {
        const loginSucces = await uctx.login(username,password);
        if (!loginSucces) {
            setLoginInvalid(true);
        }

    };

    useEffect(() => {
        if (uctx.loggedIn) {
            navigate(RoutePath.ROOT);
        }
        // eslint-disable-next-line
    }, [uctx.loggedIn]);
    return <div className="login_outer">
        <div className="login_inner">
        <img className="login_qr_code" src={qr} alt="qr" />
        <div className="login_welcome_text">
            Welcome!
        </div>
        <div className="login_sub_text">
        Sign in to your account
        </div>
        <div className={usernameFocussed ? "login_input_outer focussed" : "login_input_outer"  }>
        <div className="login_input_icon"><PiUserFill /></div>
        <input value={username} onChange={(e) => {
            setLoginInvalid(false);
            setUsername(e.target.value)}} type="text" onFocus={() => {setUsernameFocussed(true)}} onBlur={() => {setUsernameFocussed(false)}} placeholder="Username" />
        </div>
        <div className={passwordFocussed ? "login_input_outer focussed" : "login_input_outer"  }>
        <div className="login_input_icon"><PiLockKeyFill  /></div>
        <input className="login_input_password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => {setPasswordFocussed(true)}} onBlur={() => {setPasswordFocussed(false)}} placeholder="Password" type={passwordVisible ? "text" : "password"}/>
        <div className="login_input_icon_password_visibility" onClick={() => {setPasswordVisible(state => !state)}}>{passwordVisible ? <PiEye  /> : <PiEyeSlash /> }</div>
        </div>
        <div className="login_error">
           {loginInvalid ? "Invalid username / password provided" : ""}
        </div>
        <div className="login_submit_button" onClick={onLogin}>
            LOGIN
        </div>
        </div>
    </div>
};

export default Login;