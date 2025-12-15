import React from 'react';
import UserProfileCard from '../components/ui/UserProfileCard';
import OnboardingTask from '../components/ui/OnboardingTask';
import StatsCard from '../components/ui/StatsCard';
import {useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { ChartNoAxesCombined, ClipboardPenLine, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
    const userDetail = useSelector((state: RootState) => state.user);

    return (
        <div className="min-h-screen text-gray-800">
            <main className="p-6 md:p-8 lg:p-7">
                <h1 className="text-4xl font-light mb-2">Xin chào, {userDetail?.fullname}</h1>
                <div className="flex w-full items-center space-x-8 mb-5 text-sm">
                    <div className='flex w-1/2  items-center space-x-8'>
                        {['Interviews', 'Hired', 'Project time', 'Output'].map((label, index) => (
                            <div key={label} className="flex-1 max-w-[150px]">
                                <p className="font-semibold mb-1">{label}</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div 
                                        className="h-2.5 rounded-full bg-green-500" 
                                        style={{ width: ['15%', '15%', '60%', '10%'][index] }}
                                    ></div>
                                </div>
                                <span className="mt-1 block font-bold text-xs">
                                    {['15%', '15%', '60%', '10%'][index]}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 rounded-xl flex w-1/2 justify-evenly items-center space-x-8">
                        <StatsCard title="Employees" value={78} icon={<Users/>} />
                        <StatsCard title="Hirings" value={56} icon={<ClipboardPenLine/>}/>
                        <StatsCard title="Projects" value={203} icon={<ChartNoAxesCombined/>} />
                    </div>
                </div>
                <div className="flex w-full gap-5">
                    <div className="flex-1">
                        <UserProfileCard />
                    </div>
                    <div className="flex-2">
                        <div className="flex">
                            <div className="flex-2">
                                <OnboardingTask />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;