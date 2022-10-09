import React from 'react';
import { Link } from 'react-router-dom';


// page when user goes to wrong adress or tries to access wrong way
const Nopage = () => {
    return (
        <>
            <h1>404</h1>
            <h3>Wrong way!</h3>
            <Link to="/">Go to Home</Link>
        </>
    )
}

export default Nopage;