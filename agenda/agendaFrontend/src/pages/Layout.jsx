import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"


// return navbar and active route
const Layout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default Layout;