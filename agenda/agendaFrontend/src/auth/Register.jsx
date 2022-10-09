import React, { useState, useEffect} from "react";
import CSRFTOKEN from "../csrftoken";
import "../styles/login-register.css"


function Register() {

    // set variables for loggin in
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    // check if user is logged on
    useEffect(() => {
        if (localStorage.getItem('userId') !== null) {
            window.location.replace('/')
        }
    })

    // set error message to zero if username,email,password or confirm is updated
    useEffect(() => {
        setErrMsg('')
    },[username, email, password, confirmPassword])


    // handle registration
    const handleSubmit = (e) => {
        e.preventDefault()

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

        const user = {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }

        fetch('/api/auth/register', {
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
                    console.log('success')
                    localStorage.clear()
                    localStorage.setItem('userId', data['userData']['id'])

                    // load homepage
                    window.location.replace('/')
                }
            })
            .catch(error => console.log(error))

    }

    return (
        <div className="register">
            <form onSubmit={handleSubmit} autoComplete='off'>
                <CSRFTOKEN />
                <div className="form-group">
                    <label htmlFor="username">Username</label> <br/>
                    <input 
                        className="form-control"
                        type="text"
                        name="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label> <br/>
                    <input 
                        className="form-control"
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label> <br/>
                    <input 
                        className="form-control"
                        type="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label> <br/>
                    <input 
                        className="form-control"
                        type="password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <p className="err-msg">{errMsg}</p>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
        </div>
    )
}


export default Register