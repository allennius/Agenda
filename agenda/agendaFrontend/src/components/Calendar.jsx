import React from "react";
import { useState } from "react"
import CalendarDays from "./CalanderDays";
import "../styles/calendar.css"

function Calendar() {

    // to get monthname from monthnumber
    const months = ["January", "Februari", "March", "April", "May", "June",
        "Juli", "August", "September", "October", "November", "December"
    ];

    // to get weekday from daynumber
    const daysInWeek = ["Mon", "Tue", "Wed", "Thu",
                    "Fri", "Sat", "Sun"]

    
    const currentDate = new Date()

    // date
    const [calendar, setCalendar] = useState({
        date: currentDate,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        day: currentDate.getDate()
    });


    const nextMonth = (number) => {

        // check if year should change, if so, change it
        let year = calendar.date.getFullYear()
        if (number < 0) {
            year = calendar.date.getMonth() === 0 ? year - 1 : year
        } else {
            year = calendar.date.getMonth() === 11 ? year + 1 : year
        }

        // set month
        let month = calendar.date.getMonth() + number
        if (month === -1) {month = 11}
        if (month === 12) {month = 0}

        // set day to current date if current month, else 0
        let day = month === currentDate.getMonth() && year === currentDate.getFullYear() ? currentDate.getDate() : 0
        setCalendar(prevState => {
            return {
                ...prevState,
                date: new Date(year, month),
                month: month,
                year: year,
                day: day
            }
        })
    }


    return (
        <>
            <div className="calendar">
                <div className="calendar-header">
                    <button onClick={() => nextMonth(-1)} className="previous-month arrow"></button>
                    <h3 className="header">{months[calendar.month]} {calendar.year}</h3>
                    <button onClick={() => nextMonth(1)} className="next-month arrow"></button>
                </div>
                <div className="calendar-body">
                    <div className="calendar-weekdays">
                        {daysInWeek.map((weekday) => {
                            return ( 
                                <div key={weekday} className="calendar-weekday">
                                   <h6>{weekday}</h6>
                                </div>
                            )
                        })}
                    </div>
                    <div className="calendar-days">
                        <CalendarDays calendar={calendar} />
                    </div>
                </div>
            </div>
        </> 
    )
}

export default Calendar