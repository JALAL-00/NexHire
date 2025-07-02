import Image from 'next/image';
import Link from 'next/link';
import { Link as LinkIcon, Phone, Mail, Bookmark, Briefcase } from 'lucide-react';
import { Job } from '@/types';


export const JobDetailHeader = ({ job }: { job: Job }) => {
  
  // Safely format the expiration date if it exists.
  const expirationDateFormatted = job.expirationDate 
    ? new Date(job.expirationDate).toLocaleDateString() 
    : 'N/A';

  return (
    <div className="card bg-base-100 shadow-md p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <figure className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">

          <Briefcase size={60} className="text-gray-400" />
        </figure>
        <div className="flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>

            {job.status === 'Expired' && <div className="badge badge-error badge-outline">Expired</div>}
          </div>

          <div className="flex items-center gap-x-6 gap-y-2 text-sm text-gray-500 flex-wrap mt-3">
            {job.recruiter?.recruiterProfile?.website && (
              <a href={job.recruiter.recruiterProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                <LinkIcon size={16} /> {job.recruiter.companyName || 'Website'}
              </a>
            )}
            {job.recruiter?.phone && (
              <span className="flex items-center gap-2"><Phone size={16} /> {job.recruiter.phone}</span>
            )}
            {job.recruiter?.email && (
               <a href={`mailto:${job.recruiter.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail size={16} /> {job.recruiter.email}
              </a>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 w-full sm:w-auto">
          <button className="btn btn-outline btn-square"><Bookmark /></button>
          <Link href={`/apply/${job.id}`} className="btn btn-primary flex-grow">Apply Now →</Link>
        </div>
      </div>
      <p className="text-right text-sm text-gray-400 mt-2">Job expires on: {expirationDateFormatted}</p>
    </div>
  );
};