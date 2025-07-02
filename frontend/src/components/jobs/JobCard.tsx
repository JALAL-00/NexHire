// src/components/jobs/JobCard.tsx
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { Job } from '@/types'; // Import your main Job type

const JobCard = ({ job }: { job: Job }) => {
  const cardClasses = `
    card bg-base-100 shadow-md p-6 border rounded-lg transition-all 
    hover:shadow-xl hover:-translate-y-1 relative group
  `;

  // Get the first letter of the company name for the placeholder
  const companyInitial = job.recruiter?.companyName?.charAt(0).toUpperCase() || 'C';

  return (
    <div className={cardClasses}>
      {/* Card Content */}
      <div className="flex items-start gap-4">
        {/* --- FIX: Display company initial instead of a logo --- */}
        <figure className="w-14 h-14 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-primary">{companyInitial}</span>
        </figure>
        <div className="flex-grow">
          <p className="text-gray-500 text-sm">{job.recruiter?.companyName || 'A Company'}</p>
          <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
            <MapPin size={14} /> {job.location}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="card-title text-lg font-bold text-gray-800">{job.title}</h2>
        <p className="text-sm text-gray-500 mt-2">{job.jobType || 'Full Time'} • {job.salary}</p>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link href={`/jobs/${job.id}`} className="btn btn-outline btn-primary">View Job</Link>
        <Link href={`/jobs/${job.id}`} className="btn btn-primary">Apply Now</Link>
      </div>
    </div>
  );
};

export default JobCard;