import React from "react";


function Logout(props) {

    console.log(localStorage['userId']) 
    console.log(props.csrftoken)

    
    const csrftoken = props.csrftoken
    const user = {userId: localStorage.getItem('userId')}
    console.log(JSON.stringify(user))
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