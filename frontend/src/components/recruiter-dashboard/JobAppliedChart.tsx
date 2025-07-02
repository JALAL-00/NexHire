// src/components/recruiter-dashboard/JobAppliedChart.tsx
'use client'; // <-- ADD THIS LINE

import { jobAppliedChartData } from '@/lib/mock-recruiter-data';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const JobAppliedChart = () => (
  <div className="card bg-base-100 shadow-md p-6 border rounded-lg h-96">
    <h2 className="text-xl font-bold mb-4">Job Applied</h2>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={jobAppliedChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorApplied" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorInterview" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="grey" />
        <YAxis stroke="grey" />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="Applied" stroke="#4F46E5" fillOpacity={1} fill="url(#colorApplied)" />
        <Area type="monotone" dataKey="Interview" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorInterview)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
export default JobAppliedChart;