// src/components/jobs/JobListItem.tsx
import { MapPin, DollarSign, Calendar, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Job } from '@/types'; // Import your main Job type
import { calculateDaysRemaining } from '@/lib/utils'; // Import our new helper

// This component now uses the central Job type
const JobListItem = ({ job }: { job: Job }) => {
  const cardClasses = `
    card card-side bg-base-100 p-4 items-center border rounded-lg 
    transition-all hover:shadow-lg hover:border-primary
  `;

  // Get the first letter of the company name for the placeholder
  const companyInitial = job.recruiter?.companyName?.charAt(0).toUpperCase() || 'C';

  return (
    <div className={cardClasses}>
      {/* --- FIX: Display company initial instead of a logo --- */}
      <figure className="w-20 h-20 bg-primary/10 rounded-md flex items-center justify-center ml-4 flex-shrink-0">
        <span className="text-3xl font-bold text-primary">{companyInitial}</span>
      </figure>
      
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{job.recruiter?.companyName || 'A Company'}</p>
            <h2 className="card-title text-lg font-semibold text-gray-800 mt-1">{job.title}</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap mt-2">
          <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
          <span className="flex items-center gap-1.5"><DollarSign size={16} /> {job.salary}</span>
          {/* --- FIX: Use the dynamic date calculation --- */}
          <span className="flex items-center gap-1.5">
            <Calendar size={16} /> {calculateDaysRemaining(job.expirationDate)}
          </span>
        </div>

        {/* --- NEW: Redesigned skills section --- */}
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills && job.skills.slice(0, 4).map(skill => ( // Show up to 4 skills
            <div key={skill} className="badge badge-ghost">
              {skill}
            </div>
          ))}
          {job.skills && job.skills.length > 4 && (
            <div className="badge badge-ghost">+{job.skills.length - 4} more</div>
          )}
        </div>
      </div>

      <div className="card-actions justify-end items-center gap-4 pr-4">
        <button className="btn btn-ghost btn-square text-gray-400 hover:text-primary">
          <Bookmark />
        </button>
        <Link href={`/jobs/${job.id}`} className="btn btn-primary">
          Apply Now →
        </Link>
      </div>
    </div>
  );
};

export default JobListItem;