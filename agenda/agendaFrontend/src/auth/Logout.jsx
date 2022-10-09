import React from "react";


function Logout(props) {

    // get csrftoken and userId
    const csrftoken = props.csrftoken
    const user = {userId: localStorage.getItem('userId')}

    // handle logout
    fetch('/api/auth/logout', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        }, 
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            console.log(data['message'])

            // clear userId and go to homepage
            localStorage.clear()
            window.location.replace('/')
        })
        .catch((error) => {
            console.log(error)
        })
    return (
        <div>logout</div>
    )
}


export default Logout