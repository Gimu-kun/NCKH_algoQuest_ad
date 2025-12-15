// src/components/OnboardingTask.tsx
import React from 'react';
import { Calendar, Users, DollarSign, Link, Settings } from 'lucide-react';

const OnboardingTask: React.FC = () => {
    const tasks = [
        { icon: <Calendar className="w-5 h-5" />, title: "Interview", time: "Sep 13, 08:30" },
        { icon: <Users className="w-5 h-5" />, title: "Team-Meeting", time: "Sep 13, 10:30" },
        { icon: <DollarSign className="w-5 h-5" />, title: "Project Update", time: "Sep 13, 13:00" },
        { icon: <Settings className="w-5 h-5" />, title: "Discuss Q3 Goals", time: "Sep 13, 14:45" },
        { icon: <Link className="w-5 h-5" />, title: "HR Policy Review", time: "Sep 13, 16:30" },
    ];

    return (
        <div className="grid grid-cols-12 gap-6 h-full">
            
            {/* Phần tiến trình Onboarding (Col 1: Chiếm 5/12) */}
            <div className="col-span-12 md:col-span-5 p-6 bg-amber-50 rounded-xl shadow-sm flex flex-col justify-between">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold">Onboarding</h3>
                    <p className="text-5xl font-light mt-2">18%</p>
                </div>

                {/* Thanh tiến trình ngang */}
                <div className="w-full h-2.5 bg-gray-200 rounded-full mb-4">
                    <div 
                        className="h-2.5 rounded-full bg-yellow-500" 
                        style={{ width: '30%' }}
                    ></div>
                </div>
                
                {/* Chú thích % */}
                <div className="flex justify-between text-sm font-semibold">
                    <span>30%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>

                {/* Thanh trạng thái Task/Time */}
                <div className="flex mt-4 h-8">
                    <div className="flex-1 bg-yellow-500 text-white rounded-l-lg flex items-center justify-center font-medium">
                        Task
                    </div>
                    <div className="flex-1 bg-gray-300 text-gray-700 rounded-r-lg flex items-center justify-center font-medium">
                        Time
                    </div>
                </div>
            </div>

            {/* Danh sách Task (Col 2: Chiếm 7/12) */}
            <div className="col-span-12 md:col-span-7 bg-black text-white p-6 rounded-xl shadow-lg relative">
                <h3 className="text-lg font-semibold mb-4">Onboarding Task <span className="text-yellow-500">2/8</span></h3>
                
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <div 
                            key={index} 
                            className={`flex items-center p-3 rounded-lg transition-colors ${
                                index === 0 ? 'bg-gray-800' : 'hover:bg-gray-800'
                            }`}
                        >
                            <div className={`p-2 rounded-full mr-4 ${index === 0 ? 'bg-yellow-500 text-black' : 'bg-gray-700'}`}>
                                {task.icon}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{task.title}</p>
                                <p className="text-xs text-gray-400">{task.time}</p>
                            </div>
                            {/* Checkbox/Status */}
                            <div className={`w-5 h-5 rounded-full border-2 ${index === 0 ? 'border-yellow-500' : 'border-gray-500'} flex items-center justify-center`}>
                                {index !== 0 && <span className="text-yellow-500">✓</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnboardingTask;