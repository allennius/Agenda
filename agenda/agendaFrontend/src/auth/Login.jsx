import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import CSRFTOKEN from "../csrftoken";
import "../styles/login-register.css"


function Login() {
    
    // variables for login form
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    // testing naviage instead of window.location.replace
    const navigate = useNavigate();

    // if user is logged on navigate to homepage
    useEffect(() => {
        if (localStorage.getItem('userId') !== null) {
            navigate('/')
        }
    }, [])

    // set error message to blank if username or password updates
    useEffect(() => {
        setErrMsg('');
    }, [username, pwd])

    
    // handle login
    const handleSubmit = (e) => {
        e.preventDefault();

        const user = {
            username: username,
            password: pwd
        }

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

        fetch("/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(data => {
                if (data['error']){
                    setErrMsg(data['error'])
                }
                if (data['success']) {

                    // clear userId - set userId - go to homepage
                    localStorage.clear();
                    localStorage.setItem('userId', data['userdata']['id'])
                    window.location.replace('/')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // localStorage.setItem('token', true)

    return (
        <div className="login">
            <form onSubmit={handleSubmit} autoComplete="off">
                <CSRFTOKEN />
                <div className="form-group">
                    <label htmlFor="username">Username</label> <br />
                    <input 
                        className="form-control"
                        type="text" 
                        id="username" 
                        name="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label> <br />
                    <input 
                        className="form-control"
                        type="password" 
                        id="password" 
                        name="password"
                        value={pwd}
                        onChange={e => setPwd(e.target.value)}
                        required
                    />
                </div>
                <p className="err-msg">{errMsg}</p>
                <input type="submit" className="btn btn-primary" value="Sign in" />
            </form>
            
        </div>
    )
}

export default Login