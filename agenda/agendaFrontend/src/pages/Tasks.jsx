import React from "react";
import { useEffect, useState } from "react";
import CSRFTOKEN from "../csrftoken";
import "../styles/tasks.css"

const Tasks = () => {

    const [tasks, setTasks] = useState([])
    
    useEffect(() => {
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
                    tasks: true,
                    userId: localStorage.getItem('userId')
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data){
                    setTasks(data)
                    loadTodos()
                }
            })
            .catch(error => console.log(error))
        }
    }, []);


    const loadTodos = () => {
        return (
            <>
                {tasks.map((task) => {
                    return( 
                        <div key={task['id']}>
                            <div className="todo-list">
                                <div className="todo-check">
                                    <input data-key={'todoDay'} data-id={task['id']} onChange={e => toggleCompleted(e.target)} type="checkbox" className={' form-check-input'}/>
                                </div>
                                <div className="todo-title">
                                    <small>{task['title']}</small>
                                </div>
                                <div className="todo-date">
                                    <small>{task['date']}</small>
                                </div>
                                <div className="todo-todo">
                                    {task['todos'].map((todo) => (
                                        <div key={todo['id']}>
                                            {todo['completed'] 
                                                ?
                                                <input checked={true} data-key={'todo'} data-dayid={task['id']} data-id={todo['id']} onChange={e => toggleCompleted(e.target)} type="checkbox" className={' form-check-input'}/>
                                                :
                                                <input data-key={'todo'} data-dayid={task['id']} data-id={todo['id']} onChange={e => toggleCompleted(e.target)} type="checkbox" className={' form-check-input'}/>
                                            }
                                            
                                            <small className={todo['completed'] ? 'checked' : ''}>{todo['todo']}</small>
                                        </div>
                                        )
                                    )}                            
                                </div>
                            </div>
                        </div>
                    )
                })}
            </>
        )
    }
 

    const toggleCompleted = (e) => {

        (e.checked && e.dataset.key === 'todoDay') ? e.parentElement.parentElement.classList.add('checked') :
            e.parentElement.parentElement.classList.remove('checked')

            e.checked = e.checked ? true : false


        const dayId = (e.dataset.dayid) ? e.dataset.dayid : e.dataset.id
        const todoId = (e.dataset.dayid) ? e.dataset.id : null

        fetch('/api/toggleCompletedTasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value },
            body: JSON.stringify({
                dayId: dayId,
                todoId: todoId,
                completed: e.checked  
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.log(error))
            
        

    }

    return (
        <div className="tasks-container">
            <CSRFTOKEN />
            <div className="todo-list"></div>

            {/* check if there is any todos */}
            {tasks[0] 
                ?
                <div>{loadTodos()}</div>
                :
                <div><h3>Nothing todo</h3></div>
                }

            <input onClick={() => window.location.reload()} type="button" className="btn btn-primary" value="Update" />
        </div>
    )
}

export default Tasks;