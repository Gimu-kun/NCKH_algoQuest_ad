import React, { useEffect, useState } from 'react';
import { Settings, Bell, LogOut } from 'lucide-react'; // Sử dụng lucide-react cho icons
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import authApiService from '../../service/apis/authApiService';
import { init } from '../../store/slices/useSlice';

const Header: React.FC = () => {
    const navItems = [{
        label:'Bảng điều khiển',
        url:'/main/dashboard'
    },{
        label:'Quản lý người dùng',
        url:'/main/users'
    },{
        label:'Quản lý chủ đề',
        url:'/main/topics'
    },{
        label:'Quản lý màn chơi',
        url:'/main/quests'
    },{
        label:'Quản lý bài học',
        url:'/main/lessons'
    },{
        label:'Quản lý câu hỏi',
        url:'/main/questions'
    }];
    const param = useLocation().pathname.split("/")[2];
    const [activeMenu, setActiveMenu] = useState<string>('dashboard')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getToken = async () => {
        const token = Cookies.get("access_token");
        if (!token) {
            navigate("/");
            return;
        }
        try{
            const res = (await authApiService.verify(token)).data;
            if(!res){
                Cookies.remove("access_token");
                navigate("/");
                return;
            }
            dispatch(init(res))
        }catch(ex){
            Cookies.remove("access_token");
            navigate("/");
            return;
        }
    }
    
    useEffect(()=>{
        getToken();
        setActiveMenu(param)
    },[])

    const handleLogout = () => {
        Cookies.remove('access_token');
        navigate("/");
    }

    return (
        <header className="bg-white shadow-md py-3 px-8 sticky top-0 z-10 flex justify-between items-center">
            <div className="text-xl font-bold text-gray-900 mr-8">AlgoQuest Dashboard</div>

            <nav className="hidden lg:flex flex-1 justify-center space-x-6">
                {navItems.map(item => (
                    <Link 
                        key={item.label} 
                        to={item.url}
                        onClick={()=>{setActiveMenu(item.url.split("/")[2])}}
                        className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                            item.url.split("/")[2] === activeMenu 
                                ? 'bg-black text-white' 
                                : 'text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center space-x-4">
                <a href="/settings" className="p-2 text-gray-500 hover:text-gray-800 rounded-full bg-gray-100 transition-colors">
                    <Settings className="w-5 h-5" />
                </a>
                <a href="/notifications" className="p-2 text-gray-500 hover:text-gray-800 rounded-full bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5" />
                </a>
                <div onClick={handleLogout} className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold cursor-pointer">
                    <LogOut className="w-5 h-5" />
                </div>
            </div>
        </header>
    );
};

export default Header;