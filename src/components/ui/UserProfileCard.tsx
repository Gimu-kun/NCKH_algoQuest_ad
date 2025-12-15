// src/components/UserProfileCard.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const UserProfileCard: React.FC = () => {
    return (
        <div className="h-full p-6 bg-white rounded-xl shadow-lg space-y-6">
            <div className="relative flex items-center space-x-4">
                <div className="w-full rounded-xl overflow-hidden shadow-md">
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-o6r4SFdwszMhKpEZ9X4rQgdA5mj5HNSPzQ&s" 
                        alt="Lora Piterson" 
                        className="w-full h-full" 
                    />
                </div>
                <div className="
                    absolute bottom-0 w-full
                    bg-gradient-to-t from-black to-[transparent]
                    p-5
                ">
                    <h2 className="text-xl font-bold text-amber-50">Lora Piterson</h2>
                    <p className="text-xs text-gray-200">UX/UI Designer</p>
                    <div className="mt-2 p-1 px-3 bg-gray-100 rounded-lg inline-block font-semibold text-sm">
                        $1,200
                    </div>
                </div>
            </div>

            {/* Các mục thông tin thêm */}
            <div className="space-y-4 text-sm font-medium">
                {[
                    { title: "Pension contributions", detail: "M1" },
                    { title: "Devices", detail: "MacBook Air" },
                    { title: "Compensation Summary", detail: "View" },
                ].map((item) => (
                    <div key={item.title} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700">{item.title}</span>
                        <div className="flex items-center space-x-2 text-gray-500">
                            {item.title === "Devices" && <span className="text-xs text-red-500">Version M1</span>}
                            <span>{item.detail}</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserProfileCard;