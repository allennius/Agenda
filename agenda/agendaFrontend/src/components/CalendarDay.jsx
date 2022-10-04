import React from "react";
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from "react";
import NoPage from "../pages/NoPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.min.js";
import "../styles/calendarDay.css"
import CSRFTOKEN from "../csrftoken";


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
    // data retrieved from fetch request
    const [tasks, setTasks] = useState([])

    // useEffect to load data on page render
    useEffect(() => {
        loadTasks()
    }, [])

    const loadTasks = () => {
        if (localStorage.getItem('userId')) {
            fetch('/api/loadTasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({
                    calendarDay: true,
                    userId: localStorage.getItem('userId'),
                    year: day.day.getFullYear(),
                    month: day.day.getMonth(),
                    date: day.day.getDate(),
                })
            })
            .then(response => response.json())
            .then(data => {
                setTasks(data)
            })
            .catch(error => console.log(error))
        }
    }

    // update values in form
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log(inputs)
        setInputs(prevState => ({...prevState, [name]: value}))
    }

    // state for toggle showing extra tasks
    const [showInput, setShowInput] = useState({})
    let i = 0

    // toggle state for showing or hiding extra tasks
    const addInput = (event) => {
        const i = event.target.dataset.key

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
        let stringName = "todo" + i
        return (
            <>
                <div className="form-group">
                    <label>Todo: 
                        <input 
                            className="form-control todo-input"
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

    // toggle tasks when checked
    const toggleCompleted = (e) => {

        (e.checked && e.dataset.type === 'task') ? e.parentElement.parentElement.parentElement.classList.add('check') :
            e.parentElement.parentElement.parentElement.classList.remove('check')

        const checked = e.checked ? true : false
        const dayId = e.dataset.dayid
        const todoId = e.dataset.todoid ? e.dataset.todoid : null

        fetch('/api/toggleCompletedTasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },
            body: JSON.stringify({
                dayId: dayId,
                todoId: todoId,
                completed: checked  
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))

    }


    // handle addtask formsubmit
    const handleAddTask = (e) => {
        e.preventDefault();

        // create variables for task and todos(if any)
        const task = document.querySelector('.task-input').value
        const todos = []
        document.querySelectorAll('.todo-input').forEach((todo) => {
            if (todo.value) {todos.push(todo.value)}
        })
        

        // add fetch request for adding task
        if (localStorage.getItem('userId') && task) {
            fetch('/api/addTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    task: task,
                    todos: todos,
                    date: day.day.getDate(),
                    month: day.day.getMonth(),
                    year: day.day.getFullYear()
                })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.log(error))
            window.location.reload()
        }
    }


    return (
        <div className="add-task-container">
            <CSRFTOKEN />
            <div className="task-header">
                <h6 className="header"> {day.day.getDate()} {months[day.day.getMonth()]}  {day.day.getFullYear()} </h6>
            </div>
            {tasks[0] &&     
                <div className="tasks" id="tasks">
                    {tasks.map((task) => {
                        return(  
                            <div key={task.task.id} className="task"> 
                                <p> {task.task.title} </p>
                                <div className="checkboxTodo">
                                {task.todos.map((todo) => {
                                    return (
                                            <label key={todo.id}>
                                                <input type="checkbox" id="todo" data-type={'todo'} data-todoid={todo.id} data-dayid={task.task.id} onChange={e => toggleCompleted(e.target)} />
                                                <span className={todo.completed ? 'checked' : ''}> {todo.todo} </span>
                                            </label>
                                    )
                                })}
                                </div>
                                <div className="checkboxTask">
                                    <label>
                                        <input type="checkbox" id="task" data-type={'task'} data-dayid={task.task.id} onChange={e => toggleCompleted(e.target)} />
                                        <span> check {task.task.title} </span>
                                    </label>
                                </div>
                            </div>
                        )
                    })}
                    <input onClick={() => window.location.reload()} type="button" value="update" className="btn-primary-calendarDay btn btn-primary" />
                </div>
            }
            <div className="gap"> ---------- </div>
            <div className="task-form">
                <form onSubmit={handleAddTask}>
                    <div className="form-group">
                        <label>Task:
                            <input 
                                className="form-control task-input"
                                aria-describedby="Title for task"
                                type="text"
                                name="task"
                                value={inputs.task || ""}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div className="subject-task-gap"> ---------- </div>
                    <div className="form-group">
                        <label>Todos: 
                            <input
                                className="form-control todo-input"
                                type="text"
                                name="todo0"
                                value={inputs.todo0 || ""}
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
                    <input  type="submit" className="btn-primary-calendarDay btn btn-primary" value="Add Task" />
                </form>
            </div>
        </div>
    )
}

export default CalendarDay