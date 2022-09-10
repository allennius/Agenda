import React from "react";
// import { useState } from "react";
import { Link } from 'react-router-dom';
// import CalendarDay from "./CalendarDay";


function CalendarDays(props) {
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

    // // keep track on if day is sopposed to be rendered
    // const [clicked, setClicked] = useState(false)    

    // const CallCalendarDay = (index) => {
    //     console.log(clicked)
    //     setClicked(prevState => ({
    //         [index]: !prevState[index]
    //     }))
    // }

    return (
        calendardays.map((day) => {
            return (
                <>
                    <Link key={day.day} to="CalendarDay" state={{ day: day.day }}>
                        <div key={day.day} className={"calendar-day " + (day.isMonth ? "current-month " : "not-current-month") + (day.isToday ? "current-day" : "")}>
                            <p key={day.day}>{day.day.getDate()}</p>
                            {/* {clicked[index] ? <CalendarDay day={day.day} /> : null} */}
                        </div>
                    </Link>
                </>
            )
        })
    )
}

export default CalendarDays