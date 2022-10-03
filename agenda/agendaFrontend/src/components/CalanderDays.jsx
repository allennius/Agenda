import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import CSRFTOKEN from "../csrftoken";
// import CalendarDay from "./CalendarDay";


function CalendarDays(props) {

    // const initialState = [{day: 0, title: ''}]
    const [tasks, setTasks] = useState([])


    // fetch this months tasks, update when props change
    useEffect(() => {
        if (localStorage.getItem('userId')){
            fetch('/api/loadTasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({
                    calendarDays: true,
                    userId: localStorage.getItem('userId'),
                    year: props.calendar.year,
                    month: props.calendar.month,
                })
            })
            .then(response => response.json())
            .then(data => {

                setTasks(data)

            })
            .catch(error => console.log(error))
            
        }
    }, [props])


    const loadTasksToCalendar = (day) => {

        let taskCounter = 0
        let title = ''

        // loop through tasks for this month for this user
        tasks.forEach((element) => {
            // if day is in the task list then add to counter
            if (element['day'] === day){
                taskCounter++ 

                // if more than one task on same day show number of tasks
                if (taskCounter > 1) {
                    title = `( ${taskCounter} tasks )`

                    // else show title
                } else {
                    title = element['title']
                }
            }        
        })
        
        // if day is in task list then return div as notification
        //  else return empty
        return (
            taskCounter > 0 
            ? 
            <div className="todo-in-calendar"><small>{title}</small></div> 
            :
            <div></div>
        )
    }

    // first date of the month
    let dayTracker = new Date(props.calendar.year, props.calendar.month, 1)
    
    let calendardays = []

    // set tracker to be first day you want in your month
    // depending on the first day of the month

    // incase day === 0 we need to set to get correct result -6 or else (...getDate() - -1 = (...getDate() + 1)
    dayTracker.setDate(dayTracker.getDate() - (dayTracker.getDay() === 0 ? 6 : dayTracker.getDay() - 1))

    // 42 days if we need a week before and after current month
    for (let day = 0; day < 42; day++) {


        // break if dayTracker is on next month and week is done
        if (dayTracker.getMonth() ===(props.calendar.month + 1) && day % 7 === 0) {
            break;
        }

        // create calendarday
        let calendarday = {
            day: new Date(dayTracker),
            isMonth: props.calendar.month === dayTracker.getMonth() ? true : false,
            isToday: props.calendar.day === dayTracker.getDate() ? true : false
        }

        calendardays.push(calendarday)

        // go to next date in dayTracker
        dayTracker.setDate(dayTracker.getDate() + 1)

    }

    return (
        calendardays.map((day) => {
            return (
                    <Link key={day.day} to="CalendarDay" state={{ day: day.day }}>
                        <CSRFTOKEN />
                        <div key={day.day} className={"calendar-day " + (day.isMonth ? "current-month " : "not-current-month") + (day.isToday ? "current-day" : "")}>
                            <p key={day.day}>{day.day.getDate()}</p>
                            {day.isMonth && tasks[0] ? loadTasksToCalendar(day.day.getDate()) :
                                <div></div>
                                // <div className="todo-in-calendar"><small>get</small></div>
                            }       
                            {/* {clicked[index] ? <CalendarDay day={day.day} /> : null} */}
                        </div>
                    </Link>
            )
        })
    )
}

export default CalendarDays