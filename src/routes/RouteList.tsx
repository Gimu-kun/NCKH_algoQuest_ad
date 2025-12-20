import { Route, Routes } from "react-router-dom"
import AuthLayout from "../components/layout/AuthLayout"
import SignIn from "../pages/SignIn"
import MainLayout from "../components/layout/MainLayout"
import DashBoard from "../pages/DashBoard"
import TopicManager from "../pages/TopicManager"
import UserManager from "../pages/UserManager"
import QuestManager from "../pages/QuestManager"
import QuestionManager from "../pages/QuestionManager"
import LessonManager from "../pages/LessonManager"

const RouteList = () => {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout/>}>
                <Route path="/" element={<SignIn/>}/>
            </Route>
            <Route path="/main" element={<MainLayout/>}>
                <Route path="dashboard" element={<DashBoard/>}/>
                <Route path="topics" element={<TopicManager/>}/>
                <Route path="users" element={<UserManager/>}/>
                <Route path="quests" element={<QuestManager/>}/>
                <Route path="questions" element={<QuestionManager/>}/>
                <Route path="lessons" element={<LessonManager/>}/>
            </Route>
        </Routes>
    )
}

export default RouteList;