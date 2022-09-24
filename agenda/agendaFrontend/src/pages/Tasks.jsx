import React, { useState } from "react";
import CSRFTOKEN from "../csrftoken";
import "../styles/tasks.css"

const Tasks = () => {

    const tasks = [{
        "id": 1,
        "completed": "false",
        "title": "clean car",
        "date": "12",
        todos: ["vaccum and clean vindshield"]
    },
    {
        "id": 3,
        "completed": "false",
        "title": "cut lawn",
        "date": "15",
        todos: [
            "front side",
            "left side",
            "side side"
        ],
    }]
    
    const loadTasks = () => {
        if (localStorage.getItem('userId')){
            const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
            fetch("/api/loadTasks", {
                credentials: 'include',
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId')
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                console.log(data.title)
            })
            .catch(error => console.log(error))
        }
    }


    const toggleCompleted = (e) => {

        (e.checked && e.dataset.key === 'todoDay') ? e.parentElement.parentElement.classList.add('checked') :
            e.parentElement.parentElement.classList.remove('checked')

       

        fetch('/api/toggleCompletedTasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: e.value,
                completed: e.checked  
            })
        })
        .then(response => console.log(response))
            
        

    }

    const updateTasks = () => {

    }

    return (
        <div className="tasks-container">
            <CSRFTOKEN />
            <div className="todo-list"></div>
                {tasks.map((task, index) => {
                    return (
                        <div key={index} className="todo-list">
                            <div className="todo-check">
                                <input data-key={'todoDay'} onChange={e => toggleCompleted(e.target)} type="checkbox" value={task['id']} className={' form-check-input'}/>
                            </div>
                            <div className="todo-title">
                                <small>{task['title']}</small>
                            </div>
                            {/* <div className="todo-date">
                                <small>{task['date']}</small>
                            </div> */}
                            <div className="todo-todo">
                                
                                {task.todos.map((todo) => (
                                    <p>
                                        <input data-key={'todo'} onChange={e => toggleCompleted(e.target)} type="checkbox" value={task['id']} className={' form-check-input'}/>
                                        <small>{todo}</small>
                                    </p>
                                    )
                                )}                            
                        </div>
                        <div></div>
                    </div>
                )
            })}
            <input onClick={loadTasks} type="button" className="btn btn-primary" value="Update" />
        </div>
    )
}

export default Tasks;