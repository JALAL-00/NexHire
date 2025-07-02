'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Users, MoreVertical, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import Pagination from '@/components/jobs/Pagination';
import { PromoteJobModal } from '@/components/jobs/PromoteJobModal'; 
import { UpdateJobModal } from '@/components/jobs/UpdateJobModal';   

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  salary: string;
  skills: string[];
  experience: string;
  type?: string;
  status: 'Active' | 'Expired';
  applicationCount: number;
  highlighted?: boolean;
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  // To track total pages
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); 
  const router = useRouter();

const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError('');
    const token = Cookies.get('auth_token');
    if (!token) {
      alert("Authentication error. Please log in.");
      router.push('/login');
      return;
    }
    try {
      const response = await axios.get('http://localhost:3000/recruiter/jobs', {
        params: {
          page: currentPage,
          limit: 10, // You can change the limit as needed
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      // Log the response to verify the structure
      console.log("Jobs response:", response.data);

      // Check if the response contains the jobs data and totalPages
      if (response.data && response.data.jobs) {
        const formattedJobs = response.data.jobs.map((job: any) => ({
          ...job,
          status: job.status || 'Active',
          applicationCount: job.applications?.length || 0,
        }));
        setJobs(formattedJobs);
        setTotalPages(response.data.totalPages); // Set total pages from backend response
      } else {
        setError('No jobs found.');
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Could not load your jobs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, router]);


  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const openPromoteModal = (job: Job) => {
    setSelectedJob(job);
    setIsPromoteModalOpen(true);
  };

  const openUpdateModal = (job: Job) => {
    setSelectedJob(job);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      return;
    }
    const token = Cookies.get('auth_token');
    try {
      await axios.delete('http://localhost:3000/recruiter/jobs', {
        headers: { Authorization: `Bearer ${token}` },
        data: { jobId: jobId }
      });
      alert('Job deleted successfully.');
      fetchJobs();
    } catch (err) {
      console.error("Failed to delete job:", err);
      alert("There was an error deleting the job.");
    }
  };

  const toggleJobStatus = async (job: Job) => {
    const updatedStatus = job.status === 'Active' ? 'Expired' : 'Active';
    alert(`Simulating update for Job ID ${job.id} to status: ${updatedStatus}`);
  };

  return (
    <>
      <div className="bg-base-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <main className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">My Jobs ({jobs.length})</h1>
          </div>

          <div className="card bg-white shadow-lg border rounded-lg overflow-x-auto">
            <table className="table">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th>Jobs</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-10"><span className="loading loading-spinner"></span></td></tr>
                ) : error ? (
                  <tr><td colSpan={4} className="text-center py-10 text-error">{error}</td></tr>
                ) : jobs.length > 0 ? (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover">
                      <td>
                        <div className="font-bold text-gray-800">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.type || 'N/A'} • {job.experience}</div>
                      </td>
                      <td>
                        {job.status === 'Active' ? (
                          <div className="badge badge-success gap-2 text-white"><CheckCircle size={14} /> Active</div>
                        ) : (
                          <div className="badge badge-error gap-2 text-white"><XCircle size={14} /> Expired</div>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-gray-600"><Users size={16} /> {job.applicationCount} Applications</div>
                      </td>
                      <td className="text-center"> 
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/applications/${job.id}`} className="btn btn-primary btn-sm">View Applications</Link>
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle"><MoreVertical /></label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                              <li><button onClick={() => openPromoteModal(job)}><PlusCircle size={16}/> Promote Job</button></li>
                              <li><Link href={`/jobs/${job.id}`}><Eye size={16}/> View Detail</Link></li>
                              <li><button onClick={() => openUpdateModal(job)}><Edit size={16}/> Update Job</button></li>
                              <li><button onClick={() => toggleJobStatus(job)}>
                                {job.status === 'Active' ? <XCircle size={16}/> : <CheckCircle size={16}/>}
                                {job.status === 'Active' ? 'Mark as Expired' : 'Mark as Active'}
                              </button></li>
                              <div className="divider my-1"></div>
                              <li><button className="text-error" onClick={() => handleDeleteJob(job.id)}><Trash2 size={16}/> Delete Job</button></li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="text-center py-10">You have not posted any jobs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </main>
      </div>

      {/* --- Conditionally render the modals --- */}
      {isPromoteModalOpen && selectedJob && (
        <PromoteJobModal job={selectedJob} onClose={() => setIsPromoteModalOpen(false)} />
      )}
      {isUpdateModalOpen && selectedJob && (
        <UpdateJobModal job={selectedJob} onClose={() => setIsUpdateModalOpen(false)} onJobUpdated={fetchJobs} />
      )}
    </>
  );
}
