'use client';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  location: string;
  type?: string;
  status: 'Active' | 'Expired';
}

interface OpenJobsSectionProps {
  jobs: Job[];
}

export default function OpenJobsSection({ jobs }: OpenJobsSectionProps) {

  const activeJobs = Array.isArray(jobs)
    ? jobs.filter(job => !job.status || job.status === 'Active')
    : [];

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-bold mb-4">Open Jobs ({activeJobs.length})</h2>
      <div className="space-y-4">
        {activeJobs.length > 0 ? (
          activeJobs.map((job) => (
            <div key={job.id} className="border-b pb-4 last:border-b-0">
              <Link href={`/jobs/${job.id}`} className="link link-hover">
                <h3 className="font-semibold text-lg text-primary">{job.title}</h3>
              </Link>
              <p className="text-sm text-gray-600">
                {job.location} • <span className="badge badge-ghost badge-sm">{job.type || 'Full-time'}</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">There are currently no open jobs.</p>
        )}
      </div>
    </div>
  );
}