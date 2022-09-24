import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import NoPage from "./pages/NoPage";
import Register from "./auth/Register";
import Login from "./auth/Login";
import CalendarDay from "./components/CalendarDay";

export default function App() {

    const [homePage, setHomePage] = useState(<Login />)
    // localStorage.clear()
    // localStorage.setItem('token', true)

    useEffect(() => {
        if (localStorage.getItem('userId') !== null) {
            setHomePage(<Home />)
        }
    }, [])

    // setHomePage(<Login />)

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={homePage} />
                    <Route path="Tasks" element={<Tasks />} />
                    <Route path="CalendarDay" element={<CalendarDay />} />
                    <Route path="Login" element={<Login />} />

                    <Route path="Register" element={<Register />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
