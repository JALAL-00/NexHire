// --- THIS IS THE FIX (Part 1) ---
// Add 'Mail' to the import list.
import { Calendar, Clock, BookOpen, DollarSign, MapPin, Briefcase, Users, Facebook, Twitter, Instagram, Phone as PhoneIcon, Globe, Mail } from 'lucide-react';
// Import the updated, detailed Job type from your central types file.
import { Job } from '@/types';

const OverviewItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-primary mt-1" />
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

// --- THIS IS THE FIX (Part 2) ---
// The component's props now use the detailed Job type, so all errors are resolved.
export const JobOverviewSidebar = ({ job }: { job: Job }) => {
  const createdAtFormatted = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A';
  const expirationDateFormatted = job.expirationDate ? new Date(job.expirationDate).toLocaleDateString() : 'N/A';
  
  return (
    <aside className="space-y-6">
      <div className="card bg-base-100 shadow-md p-6 rounded-lg border">
        <h3 className="text-lg font-bold mb-4">Job Overview</h3>
        <div className="grid grid-cols-2 gap-y-6">
          <OverviewItem icon={Calendar} label="JOB POSTED:" value={createdAtFormatted} /> 
          <OverviewItem icon={Clock} label="JOB EXPIRES IN:" value={expirationDateFormatted} />
          <OverviewItem icon={BookOpen} label="EDUCATION:" value={job.education} />
          <OverviewItem icon={DollarSign} label="SALARY:" value={job.salary} />
          <OverviewItem icon={MapPin} label="LOCATION:" value={job.location} />
          <OverviewItem icon={Briefcase} label="JOB TYPE:" value={job.jobType} />
          <OverviewItem icon={Users} label="EXPERIENCE:" value={job.experience} />
        </div>
      </div>
      <div className="card bg-base-100 shadow-md p-6 rounded-lg border">
        <div className="flex items-center gap-4 mb-4">
          <figure className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
            <Briefcase size={32} className="text-primary" />
          </figure>
          <div>
            <h3 className="text-lg font-bold">{job.recruiter?.companyName || 'Company'}</h3>
            <p className="text-sm text-gray-500">Recruiting Company</p>
          </div>
        </div>
        
        {/* The rest of the code now works because the types are correct */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 flex items-center gap-2"><PhoneIcon size={14} /> Phone:</span> 
            <span className="font-semibold text-gray-800">{job.recruiter?.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 flex items-center gap-2"><Globe size={14} /> Website:</span> 
            {job.recruiter?.recruiterProfile?.website ? (
              <a href={job.recruiter.recruiterProfile.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary link link-hover truncate">
                {job.recruiter.recruiterProfile.website}
              </a>
            ) : (
              <span className="font-semibold text-gray-800">N/A</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 flex items-center gap-2"><Mail size={14} /> Email:</span> 
            <span className="font-semibold text-gray-800">{job.recruiter?.email || 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <a href="#" className="btn btn-square btn-outline btn-sm"><Facebook /></a>
          <a href="#" className="btn btn-square btn-outline btn-sm"><Twitter /></a>
          <a href="#" className="btn btn-square btn-outline btn-sm"><Instagram /></a>
        </div>
      </div>
    </aside>
  );
};