// src/lib/mock-recruiter-jobs.ts
//Used mock data for My jobs - manage jobs page.

// --- FIX: Define the Job type here so we can apply it to our mock data ---
interface Job {
  id: number;
  title: string;
  type: string;
  daysRemaining?: number; // Optional because expired jobs don't have it
  postedDate?: string;    // Optional because active jobs don't have it
  status: 'Active' | 'Expired'; // This is the strict type
  applicationCount: number;
  highlighted?: boolean;
}

// --- FIX: Explicitly type the array as Job[] ---
export const mockRecruiterJobs: Job[] = [
  { id: 1, title: 'UI/UX Designer', type: 'Full Time', daysRemaining: 27, status: 'Active', applicationCount: 798 },
  { id: 2, title: 'Senior UX Designer', type: 'Internship', daysRemaining: 8, status: 'Active', applicationCount: 185 },
  { id: 3, title: 'Junior Graphic Designer', type: 'Full Time', daysRemaining: 24, status: 'Active', applicationCount: 583 },
  { id: 4, title: 'Front End Developer', type: 'Full Time', postedDate: 'Dec 7, 2019', status: 'Expired', applicationCount: 740 },
  { id: 5, title: 'Technical Support Specialist', type: 'Part Time', daysRemaining: 4, status: 'Active', applicationCount: 556, highlighted: true },
  { id: 6, title: 'Interaction Designer', type: 'Contract Base', postedDate: 'Feb 2, 2019', status: 'Expired', applicationCount: 426 },
  { id: 7, title: 'Software Engineer', type: 'Temporary', daysRemaining: 9, status: 'Active', applicationCount: 922 },
  { id: 8, title: 'Product Designer', type: 'Full Time', daysRemaining: 7, status: 'Active', applicationCount: 994 },
  { id: 9, title: 'Project Manager', type: 'Full Time', postedDate: 'Dec 4, 2019', status: 'Expired', applicationCount: 196 },
  { id: 10, title: 'Marketing Manager', type: 'Full Time', daysRemaining: 4, status: 'Active', applicationCount: 492 },
];