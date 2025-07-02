// src/app/(Recruiter Dashboard)/recruiter-dashboard/page.tsx

// --- 1. IMPORT THE NEW DYNAMIC COMPONENT ---
import StatsCards from '@/components/recruiter-dashboard/StatsCards'; 
import RecruiterSidebar from '@/components/recruiter-dashboard/RecruiterSidebar';
import JobAppliedChart from '@/components/recruiter-dashboard/JobAppliedChart';
import NewApplicants from '@/components/recruiter-dashboard/NewApplicants';


export default function RecruiterDashboardPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <RecruiterSidebar />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {/* --- 2. REPLACE THE MOCK DATA MAPPING WITH THE SINGLE DYNAMIC COMPONENT --- */}
        <div className="mb-8">
          <StatsCards />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <JobAppliedChart />
          </div>
          <div>
            <NewApplicants />
          </div>
        </div>
      </div>
    </div>
  );
}