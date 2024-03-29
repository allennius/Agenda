import React from 'react';

// get csrftoken as per django docs
// https://docs.djangoproject.com/en/4.0/ref/csrf/
function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                break;
            }
        }
    }

    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

const CSRFTOKEN = () => {
    return (
        <input name='csrfmiddlewaretoken' value={csrftoken} type="hidden" />
    )
} 

export default CSRFTOKEN