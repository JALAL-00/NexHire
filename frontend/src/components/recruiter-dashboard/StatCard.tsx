// src/components/recruiter-dashboard/StatCard.tsx
'use client';

import { AreaChart, Area, ResponsiveContainer } from 'recharts';
// IMPORT the icons here, inside the Client Component
import { TrendingUp, TrendingDown } from 'lucide-react';

// A map to associate string names with actual icon components
const iconMap = {
  TrendingUp: TrendingUp,
  TrendingDown: TrendingDown,
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  // CHANGE: The prop is now a string
  iconName: 'TrendingUp' | 'TrendingDown';
  color: string;
}

const data = [ { v: 5 }, { v: 10 }, { v: 7 }, { v: 12 }, { v: 9 }, { v: 15 } ];

const StatCard = ({ title, value, change, iconName, color }: StatCardProps) => {
  // Look up the component in our map
  const IconComponent = iconMap[iconName];

  return (
    <div className="card bg-base-100 shadow-md p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          <div className="flex items-center text-sm mt-1">
            <span className={`flex items-center gap-1 ${color}`}>
              {/* Render the looked-up component */}
              {IconComponent && <IconComponent size={16} />} {change}
            </span>
            <span className="text-gray-400 ml-2">since last week</span>
          </div>
        </div>
        <div className="w-20 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatCard;