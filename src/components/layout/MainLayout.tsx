import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../ui/Header";

const MainLayout = () => {
    return (
        <Box className="w-screen min-h-screen bg-linear-to-br from-(--third-color) to-(--primary-color)">
            <Header />
            <Outlet/>
        </Box>
    );
};

export default MainLayout;