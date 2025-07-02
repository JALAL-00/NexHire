// src/lib/mock-recruiter-data.ts
//Used mock data for recruiter dashboard.

export const statsCardsData = [
  // CHANGE: The 'Icon' property is now a simple string
  { title: 'Total Jobs', value: '3918', change: '53.43%', trend: 'up', iconName: 'TrendingUp', color: 'text-success' },
  { title: 'Candidate Applied', value: '3918', change: '53.43%', trend: 'up', iconName: 'TrendingUp', color: 'text-success' },
  { title: 'Appointment', value: '3918', change: '53.43%', trend: 'down', iconName: 'TrendingDown', color: 'text-error' },
  { title: 'Job View', value: '3918', change: '53.43%', trend: 'up', iconName: 'TrendingUp', color: 'text-success' },
];

export const jobAppliedChartData = [
  { name: 'Jan', Applied: 150, Interview: 200 },
  { name: 'Feb', Applied: 180, Interview: 100 },
  { name: 'Mar', Applied: 220, Interview: 240 },
  { name: 'Apr', Applied: 190, Interview: 180 },
  { name: 'May', Applied: 250, Interview: 210 },
  { name: 'Jun', Applied: 210, Interview: 230 },
  { name: 'Jul', Applied: 230, Interview: 190 },
  { name: 'Aug', Applied: 200, Interview: 240 },
  { name: 'Sep', Applied: 240, Interview: 200 },
];

export const newApplicantsData = [
  { name: 'Jermaine Kuhlman', role: 'Human Interactions Agent', avatar: '/avatars/jalal.jpg' },
  { name: 'Sadie Yost', role: 'International Functionality...', avatar: '/avatars/jalal.jpg' },
  { name: 'Ben Langworth', role: 'Future Web Representative', avatar: '/avatars/jalal.jpg' },
  { name: 'Raymond Raynor', role: 'Human Creative Designer', avatar: '/avatars/jalal.jpg' },
];

export const todayScheduleData = [
  { time: '09:00', title: 'Fresher UI/UX Interview', avatars: ['/avatars/jalal.jpg', '/avatars/jalal.jpg', '/avatars/jalal.jpg'] },
  { time: '12:30', title: 'Onboard Intern UI/UX Desi...', avatars: ['/avatars/jalal.jpg', '/avatars/jalal.jpg'] },
];

export const applicationSummaryData = [
  { name: 'Completed', value: 400, color: '#4F46E5' },
  { name: 'Pending', value: 300, color: '#818CF8' },
  { name: 'Rejected', value: 200, color: '#C7D2FE' },
];