import { Outlet } from "react-router-dom";

const AuthLayout = () => {

    return (
        <div className="flex justify-center items-center w-screen min-h-screen bg-gradient-to-br from-[var(--third-color)] to-[var(--primary-color)]">
            <Outlet/>
        </div>
    )
}

export default AuthLayout;
