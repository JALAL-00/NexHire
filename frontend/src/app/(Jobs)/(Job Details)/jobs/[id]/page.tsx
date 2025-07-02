'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

// Import types and API functions
import { Job, User } from '@/types';
import { getMyProfile, saveJob, unsaveJob } from '@/lib/api';

// Import components and icons
import { JobOverviewSidebar } from '@/components/job-detail/JobOverviewSidebar';
import { ApplyJobModal } from '@/components/job-detail/ApplyJobModal';
import { Facebook, Twitter as TwitterIcon, Link as LinkIcon, Phone, Mail, Bookmark, Briefcase, CheckCircle } from 'lucide-react';
import { FaPinterestP } from 'react-icons/fa';


export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for save/apply functionality
  const [isSaved, setIsSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJobAndUserData = async () => {
      if (!id) {
        setError("Job ID not found.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError('');
      
      try {
        const userProfile = await getMyProfile();
        setCurrentUser(userProfile);

        const jobResponse = await axios.get(`http://localhost:3000/jobs/${id}`);
        setJob(jobResponse.data);
        
        const jobId = parseInt(id as string, 10);

        if (userProfile.role === 'candidate') {
          // Check if the job is saved
          if (userProfile.candidateProfile?.savedJobs) {
            const isJobSaved = userProfile.candidateProfile.savedJobs.some((savedJob: any) => savedJob.id === jobId);
            setIsSaved(isJobSaved);
          }
          // Check if the job has been applied to
          if (userProfile.applications) {
            // --- FIX 1: Add an explicit type for the 'app' parameter ---
            const alreadyApplied = userProfile.applications.some((app: { job: { id: number } }) => app.job?.id === jobId);
            setHasApplied(alreadyApplied);
          }
        }

      } catch (err) {
        console.error("Failed to fetch job details or user data:", err);
        setError("Could not load job details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobAndUserData();
  }, [id]);

  const handleToggleSave = async () => {
    if (!job) return;
    const currentlySaved = isSaved;
    setIsSaved(!currentlySaved);

    try {
      if (currentlySaved) {
        await unsaveJob(job.id);
        toast.success('Job removed from your list!');
      } else {
        await saveJob(job.id);
        toast.success('Job saved successfully!');
      }
    } catch (err) {
      setIsSaved(currentlySaved);
      toast.error('An error occurred. Please try again.');
      console.error(err);
    }
  };


  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen"><div className="text-center"><h2 className="text-2xl font-bold text-error">Error</h2><p>{error}</p></div></div>;
  }
  if (!job) {
    return <div className="flex justify-center items-center min-h-screen"><p>Job not found.</p></div>;
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 py-12">
          <div className="card bg-base-100 shadow-md p-6 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Figure and Job Title/Info */}
              <figure className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase size={48} className="text-primary" />
              </figure>
              <div className="flex-grow">
                 <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
                  {job.jobType && <div className="badge badge-info badge-outline">{job.jobType}</div>}
                </div>
                {/* Contact Info */}
                <div className="flex items-center gap-x-6 gap-y-2 text-sm text-gray-500 flex-wrap mt-3">
                  {job.recruiter?.recruiterProfile?.website ? (
                    <a href={job.recruiter.recruiterProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary">
                      <LinkIcon size={16} /> {job.recruiter.companyName || 'Website'}
                    </a>
                  ) : job.recruiter?.companyName ? (
                     <span className="flex items-center gap-2"><LinkIcon size={16} /> {job.recruiter.companyName}</span>
                  ) : null}
                  {job.recruiter?.phone && ( <span className="flex items-center gap-2"><Phone size={16} /> {job.recruiter.phone}</span> )}
                  {job.recruiter?.email && ( <a href={`mailto:${job.recruiter.email}`} className="flex items-center gap-2 hover:text-primary"><Mail size={16} /> {job.recruiter.email}</a> )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex items-center gap-2 w-full sm:w-auto">
                {currentUser?.role === 'candidate' && (
                  <button
                    onClick={handleToggleSave}
                    className={`btn btn-square transition-colors duration-300 ${isSaved ? 'btn-primary text-white' : 'btn-outline'}`}
                    title={isSaved ? 'Unsave Job' : 'Save Job'}
                  >
                    <Bookmark fill={isSaved ? 'currentColor' : 'none'} />
                  </button>
                )}

                {currentUser?.role === 'candidate' && (
                  <button 
                    onClick={() => !hasApplied && setIsModalOpen(true)} 
                    className="btn btn-primary flex-grow"
                    disabled={hasApplied}
                  >
                    {hasApplied ? (
                      <>
                        <CheckCircle size={18} /> Already Applied
                      </>
                    ) : (
                      'Apply Now →'
                    )}
                  </button>
                )}
                {!currentUser && (
                    <button className="btn btn-primary flex-grow" onClick={() => toast.error('Please log in to apply.')}>Apply Now →</button>
                )}

              </div>
            </div>
            {job.expirationDate && (
              // --- FIX 2 & 3: Correct the typo in toLocaleDateString ---
              <p className="text-right text-sm text-gray-400 mt-2">Job expires on: {new Date(job.expirationDate).toLocaleDateString()}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            <div className="lg:col-span-8">
              <div className="prose max-w-none">
                <h3 className="font-bold text-lg">Job Description</h3>
                <p>{job.description}</p>
                {job.responsibilities && (
                  <>
                    <h3 className="font-bold text-lg mt-6">Responsibilities</h3>
                    <div dangerouslySetInnerHTML={{ __html: job.responsibilities.replace(/\n/g, '<br />') }} />
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 mt-8 border-t pt-6">
                <span className="font-semibold">Share this job:</span>
                <button className="btn btn-sm btn-outline gap-2"><Facebook size={16}/> Facebook</button>
                <button className="btn btn-sm btn-outline gap-2"><TwitterIcon size={16}/> Twitter</button>
                <button className="btn btn-sm btn-outline gap-2"><FaPinterestP size={16}/> Pinterest</button>
              </div>
            </div>
            <div className="lg:col-span-4">
              <JobOverviewSidebar job={job} />
            </div>
          </div>
        </main>
      </div>
      {isModalOpen && (
        <ApplyJobModal 
          jobId={job.id} 
          jobTitle={job.title} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
}