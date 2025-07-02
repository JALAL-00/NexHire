'use client';

import { useState, useEffect } from 'react';
import { getRecruiterStats, RecruiterStats } from '@/lib/api';
// --- 1. IMPORT RECHARTS COMPONENTS ---
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// --- 2. CREATE MOCK DATA FOR THE SPARKLINE SHAPE ---
// This data will be used to generate the "mountain curve" for each card.
const sparklineData = [
  { value: 60 }, { value: 80 }, { value: 70 }, { value: 90 }, { value: 75 },
  { value: 100 }, { value: 85 },
];

// This is the new card component with the mini chart
const SparklineStatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => {
  return (
    <div className="card bg-base-100 shadow-md p-6 border rounded-lg flex flex-row items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {/* We can add "Since last week" or other text here if needed */}
        <p className="text-xs text-gray-400 mt-1">Since last week</p>
      </div>

      {/* --- 3. THE MINI SPARKLINE CHART --- */}
      <div className="w-24 h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id={`color_${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#color_${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// This is the main component that fetches data
const StatsCards = () => {
  const [stats, setStats] = useState<RecruiterStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getRecruiterStats();
        setStats(data);
      } catch (err) {
        setError('Could not load stats.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    // Skeleton Loader
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-md p-6 border rounded-lg h-28 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return <div className="alert alert-error">{error || "An unknown error occurred."}</div>;
  }
  
  // Define the cards using the fetched data and specify a color for each chart
  const cards = [
    { title: 'Total Jobs', value: stats.totalJobs, color: '#4F46E5' }, // Indigo
    { title: 'Total Applicants', value: stats.totalApplicants, color: '#10B981' }, // Green
    { title: 'Shortlisted', value: stats.totalShortlisted, color: '#3B82F6' }, // Blue
    { title: 'Interviews', value: stats.totalInterviews, color: '#F59E0B' }, // Amber
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(card => (
        <SparklineStatCard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default StatsCards;