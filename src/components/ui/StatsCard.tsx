import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    icon: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
    return (
        <div className="flex items-end justify-between gap-2 py-2 ">
            <div className="flex flex-col items-end">
                <span className="text-2xl">{icon}</span>
                <span className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    +5%
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-6xl font-bold text-gray-900">{value}</span>
                <span className="text-sm font-medium text-gray-500 mt-1">{title}</span>
            </div>
        </div>
    );
};

export default StatsCard;