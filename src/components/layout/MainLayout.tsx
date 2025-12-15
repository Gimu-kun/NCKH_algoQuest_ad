import { Box } from "@mui/material";
import Navbar from "../ui/Header";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../ui/Header";

const MainLayout = () => {
    return (
        <Box className="w-screen min-h-screen bg-gradient-to-br from-[var(--third-color)] to-[var(--primary-color)]">
            <Header />
            <Outlet/>
        </Box>
    );
};

export default MainLayout;