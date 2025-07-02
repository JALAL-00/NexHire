// src/components/landing/data/JobCard.tsx
import Link from 'next/link';
import { Job } from '@/types'; // Import the real Job type from your types file

// FIX: The prop type is now more flexible to handle both live and mock data shapes
interface JobCardProps {
  job: Partial<Job> & { // Use Partial<Job> to make all properties optional
    id: number;
    title: string;
    description: string;
    company?: string; // This is for your old mock data
    type?: string;
    postedAgo?: string;
  };
}

const JobCard = ({ job }: JobCardProps) => {
  // FIX: This logic now correctly handles both live data and mock data
  const companyName = job.recruiter?.companyName || job.company || 'N/A';
  const jobType = job.jobType || job.type || 'N/A';
  const postedInfo = job.postedAgo || (job.expirationDate ? `Expires: ${new Date(job.expirationDate).toLocaleDateString()}` : 'N/A');

  return (
    <div className="card bg-base-100 shadow-md border p-6 transition-all hover:shadow-lg hover:-translate-y-1 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center font-bold text-blue-600 text-2xl">
            {companyName.charAt(0)}
          </div>
        </div>
        <div className="flex-grow">
          <p className="text-sm text-gray-500">{companyName}</p>
          <h3 className="text-lg font-bold mt-1 text-gray-800">{job.title}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 flex-wrap">
            <span className="badge badge-ghost">{jobType}</span>
            {job.salary && <span className="badge badge-ghost">{job.salary}</span>}
            <span className="badge badge-ghost">{postedInfo}</span>
          </div>
        </div>
        <div className="flex-shrink-0 mt-4 sm:mt-0">
          <Link href={`/jobs/${job.id}`} className="btn btn-outline btn-primary">View Job →</Link>
        </div>
      </div>
      <p className="text-gray-600 mt-4 text-sm leading-relaxed">{job.description}</p>
    </div>
  );
};
export default JobCard;