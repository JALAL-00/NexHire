'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { getSavedJobs, unsaveJob } from '@/lib/api';
import { Briefcase, MapPin, DollarSign, Bookmark, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSavedJobs = async () => {
    setIsLoading(true);
    try {
      const jobs = await getSavedJobs();
      setSavedJobs(jobs);
    } catch (err) {
      setError('Failed to load saved jobs. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId: number) => {
    const originalJobs = [...savedJobs];
    // Optimistically update UI
    setSavedJobs(savedJobs.filter(job => job.id !== jobId));
    
    try {
      await unsaveJob(jobId);
      toast.success('Job removed from saved list.');
    } catch (err) {
      toast.error('Could not remove job. Please try again.');
      // Revert UI on failure
      setSavedJobs(originalJobs);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  if (error) {
    return <div className="text-center p-10 text-error">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">My Saved Jobs</h1>
      
      {savedJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bookmark size={48} className="mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No Saved Jobs Yet</h2>
          <p className="text-gray-500 mt-2">Start searching and save jobs you're interested in!</p>
          <Link href="/jobs" className="btn btn-primary mt-6">
            Find Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {savedJobs.map((job) => (
            <div key={job.id} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="card-body">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <Link href={`/jobs/${job.id}`} className="card-title text-xl font-bold hover:text-primary transition-colors">
                      {job.title}
                    </Link>
                    <p className="text-gray-600 mt-1">{job.recruiter?.companyName || 'A Reputable Company'}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mt-3">
                      <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><DollarSign size={14} /> {job.salary}</span>
                      <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.jobType || 'Full-time'}</span>
                    </div>
                  </div>
                  <div className="card-actions justify-end items-center self-start md:self-center">
                    <button 
                      onClick={() => handleUnsave(job.id)}
                      className="btn btn-outline btn-error btn-sm gap-2"
                    >
                      <Trash2 size={16} /> Unsave
                    </button>
                    <Link href={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}