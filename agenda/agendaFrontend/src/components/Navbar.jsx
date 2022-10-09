import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import "../styles/navbar.css";
import Logout from "../auth/Logout";
import CSRFTOKEN from "../csrftoken";



function Navbar() {

    // user logged on false as standard
    const [isAuth, setIsAuth] = useState(false)

    // set as true if user is logged in
    useEffect(() => {
        if (localStorage.getItem('userId') !== null) {
            setIsAuth(true)
        }
    }, [])

    // render logout function when logout is clicked
    const Logoutnav = () => {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
        const root = ReactDOM.createRoot(document.getElementById('root'))
        root.render(<Logout csrftoken={csrftoken} />)        
    }

    return (
        <nav id="navbar" className="navbar navbar-expand-lg bg-white">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Agenda</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        {/* if user is not logged in */}
                        {isAuth !== true ? (
                            <>
                                {' '}
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/Login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/Register">Register</Link>
                                </li>
                            </>

                        // if user is logged in
                        ) : (
                            <>
                                {' '}
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/Tasks">Tasks</Link>
                                </li>
                                <li className="nav-item">
                                    <CSRFTOKEN />
                                    <button onClick={() => Logoutnav()} className="nav-link logout-button">Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;