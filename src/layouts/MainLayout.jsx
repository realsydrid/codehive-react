import {Outlet} from "react-router-dom";
import TopNavbar from "../components/layout/TopNavbar.jsx";
import BottomNavbar from "../components/layout/BottomNavbar.jsx";

export default function MainLayout() {
    return (
        <>
            <TopNavbar/>

            <Outlet/>

            <BottomNavbar/>
        </>

    )
}