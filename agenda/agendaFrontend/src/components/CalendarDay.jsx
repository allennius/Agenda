import React from "react";
import { useLocation } from 'react-router-dom'
import { useState } from "react";
import NoPage from "../pages/NoPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import "../styles/calendarDay.css"


function CalendarDay() {


    // get state from link
    const location = useLocation()
    const day = location.state

    // if page is accessed wrong way
    if(!day) {
        return (
            <NoPage />
        )
    }

    // to get monthname from monthnumber
    const months = ["January", "Februari", "March", "April", "May", "June",
    "Juli", "August", "September", "October", "November", "December"
    ];

    // use state to update form
    const [inputs, setInputs] = useState({})

    // update values in form
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(inputs)
        setInputs(prevState => ({...prevState, [name]: value}))
    }

    // handle form submit
    const handleSubmit = (event) => {
        event.preventDefault();
        alert(inputs.subject + " " + inputs.task)
    }

    // state for toggle showing extra tasks
    const [showInput, setShowInput] = useState({})
    let i = 0

    // toggle state for showing or hiding extra tasks
    const addInput = (event) => {
        const i = event.target.dataset.key
        console.log(event.target.dataset.key)
        console.log(showInput[i])

        if (!showInput[i]) { 
            setShowInput(prevState => ({...prevState,[i]: true}))
        }else {
        console.log(showInput[i])

            setShowInput(prevState => ({...prevState, [i]: showInput[i] === false ? true : false}))
        }
    }

    // adding input field to page
    const addInputField = () => {
        i++
        let stringName = "task" + i
        return (
            <>
                <div className="form-group">
                    <label>Task: 
                        <input 
                            className="form-control"
                            type="text"
                            name={stringName}
                            value={inputs[stringName] || ""}
                            onChange={ handleChange }
                        />
                    </label>
                </div>

                {/* if + button is clicked showinput[i] toggles to true and addInputField runs */}
                {/* if - button is  clicked showinput[i-1] toggles to false and hides that input */}
                { showInput[i] ? addInputField() :
                <div className="form-group">
                    <input type="button" data-key={i} onClick={addInput} className="btn btn-secondary" value="+" />
                    <input type="button" data-key={i-1} onClick={addInput} className="btn btn-secondary" value="-" />
                </div>
                    }
            </>
        )
    }


    return (
        <div className="add-task-container">
            <div className="task-header">
                <h6 className="header"> {day.day.getDate()} {months[day.day.getMonth()]}  {day.day.getFullYear()} </h6>
            </div>
            <div className="tasks">
                <div className="task"> 
                    <p> task title </p>
                    <p> task </p>
                    <label>
                        <input type="checkbox" id="task" />
                        <span> task done </span>
                    </label>
                </div>
                <input type="button" value="update" className="btn-primary-calendarDay btn btn-primary" />
            </div>
            <div className="gap"> ---------- </div>
            <div className="task-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Subject:
                            <input 
                                className="form-control"
                                aria-describedby="Title for task"
                                type="text"
                                name="subject"
                                value={inputs.subject || ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="subject-task-gap"> ---------- </div>
                    <div className="form-group">
                        <label>Task: 
                            <input 
                                className="form-control"
                                type="text"
                                name="task0"
                                value={inputs.task0 || ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    {/* if + button is clicked showinput[i] toggles to true and addInputField runs */}
                    {showInput[0] ? addInputField() : 
                        <div className="form-group">
                            <input type="button" data-key="0" onClick={addInput} className="btn-secondary-calendarDay btn btn-secondary" value="+" />
                        </div>
                        }
                    <input type="submit" className="btn-primary-calendarDay btn btn-primary" value="Add Task" />
                </form>
            </div>
        </ div>
    )
}

export default CalendarDay