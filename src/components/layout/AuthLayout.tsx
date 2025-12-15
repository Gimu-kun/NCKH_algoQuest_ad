import { Outlet } from "react-router-dom";

const AuthLayout = () => {

    return (
        <div className="flex justify-center items-center w-screen min-h-screen bg-linear-to-br from-(--third-color) to-(--primary-color)">
            <Outlet/>
        </div>
    )
}

export default AuthLayout;
