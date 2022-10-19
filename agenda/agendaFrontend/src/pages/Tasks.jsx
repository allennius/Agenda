import React from "react";
import { useEffect, useState } from "react";
import CSRFTOKEN from "../csrftoken";
import "../styles/tasks.css"

const Tasks = () => {

    // tasks
    const [tasks, setTasks] = useState([])
    
    // load all tasks for user after page render
    useEffect(() => {

        loadTasks()

    }, []);

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
                    tasks: true,
                    userId: localStorage.getItem('userId')
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data){
                    setTasks(data)
                    console.log(data)
                    loadTodos()
                }
            })
            .catch(error => console.log(error))
        }
    }


    // render all tasks/todos to page
    const loadTodos = () => {
        return (
            <>
                {tasks.map((task) => {
                    return( 
                        <div key={task.task.id}>
                            <div className="todo-list">
                                <div className="todo-check">
                                    <input data-key={'todoDay'} data-id={task.task.id} onChange={e => toggleCompleted(e.target)} type="checkbox" className={' form-check-input'}/>
                                </div>
                                <div className="todo-title">
                                    <small>{task.task.title}</small>
                                </div>
                                <div className="todo-date">
                                    <small>{task.task.calendarDay}</small>
                                </div>
                                <div className="todo-todo">
                                    {task.todos.map((todo) => (
                                        <div key={todo.id}>
                                            {todo.completed 
                                                ?
                                                <input checked={true} data-key={'todo'} data-dayid={task.task.id} data-id={todo.id} onChange={e => toggleCompleted(e.target)} type="checkbox" className={' form-check-input'}/>
                                                :
                                                <input data-key={'todo'} data-dayid={task.task.id} data-id={todo.id} onChange={e => toggleCompleted(e.target)} type="checkbox" className={' form-check-input'}/>
                                            }
                                            
                                            <small className={todo.completed ? 'checked' : ''}>{todo.todo}</small>
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
 

    // toggles completed false/true
    const toggleCompleted = (e) => {

        // toggle class depending on checked or not
        (e.checked && e.dataset.key === 'todoDay') ? e.parentElement.parentElement.classList.add('checked') :
            e.parentElement.parentElement.classList.remove('checked')


        // data to send in request, depending on task or todo was checked
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

            {/* Update just a page reload, re renders tasks - the ones that was checked will already be completed */}
            <input onClick={() => window.location.reload()} type="button" className="btn btn-primary" value="Update" />
        </div>
    )
}

export default Tasks;