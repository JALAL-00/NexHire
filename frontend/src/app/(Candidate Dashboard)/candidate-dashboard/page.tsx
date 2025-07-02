'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import JobFilters from '@/components/candidate-dashboard/JobFilters';
import JobCard from '@/components/candidate-dashboard/JobCard';
import { Job } from '@/types';
import Pagination from '@/components/jobs/Pagination';
import { featuredJobsData } from '@/components/candidate-dashboard/land-data';
import { MapPin, DollarSign, Calendar } from 'lucide-react';
import Image from 'next/image';

export default function CandidateDashboardPage() {
  const [liveJobs, setLiveJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    skills: '',
    salary: '',
    jobType: [] as string[],
    jobTitle: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const skillsArray = filters.skills.split(',').map(s => s.trim()).filter(Boolean);

    const searchPayload: {
      location?: string;
      skills?: string[];
      salary?: string;
      jobTitle?: string;
      jobType?: string[];
      page?: number;
      limit?: number;
    } = {
      ...filters,
      skills: skillsArray,
      page: currentPage,
      limit: 10,
    };

    try {
      const response = await axios.post('http://localhost:3000/jobs', searchPayload);

      if (response.data && response.data.jobs) {
        setLiveJobs(response.data.jobs);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setLiveJobs([]); // Set to empty array if no jobs are returned
        setError('No jobs found.');
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Could not load jobs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [filters, currentPage, fetchJobs]);

  const handleFilterChange = (name: keyof typeof filters, value: string | string[]) => {
    setCurrentPage(1); // Reset to first page on filter change
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <section className="container mx-auto grid grid-cols-12 gap-8">
        <JobFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="col-span-12 md:col-span-9 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Jobs</h2>

          {isLoading ? (
            <div className="text-center py-10">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-2">Fetching jobs...</p>
            </div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : liveJobs.length > 0 ? (
            liveJobs.map(job => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No jobs found matching your criteria.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="container mx-auto py-24">
        <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center">Featured Jobs</h2>
        <div className="space-y-4 max-w-7xl mx-auto">
          {featuredJobsData.map((job, index) => (
            <div
              key={index}
              className={`
                card card-side bg-base-100 p-6 items-center border rounded-lg 
                transition-all duration-300 hover:shadow-xl hover:border-primary
                ${job.featured ? 'border-primary shadow-lg' : 'shadow-sm'}
              `}
            >
              {/* === UPDATED CODE BLOCK START === */}
              <figure className="w-28 h-28 bg-gray-100 rounded-md flex items-center justify-center ml-6 flex-shrink-0">
                {job.logo ? (
                  // If a logo URL exists, display the image
                  <Image src={job.logo} alt={`${job.title} logo`} width={56} height={56} className="object-contain" unoptimized />
                ) : (
                  // Fallback: If no logo, show the first letter of the job title
                  <div className="w-14 h-14 bg-primary text-primary-content rounded-md flex items-center justify-center">
                    <span className="text-2xl font-bold">{job.title.charAt(0)}</span>
                  </div>
                )}
              </figure>
              {/* === UPDATED CODE BLOCK END === */}

              <div className="card-body flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="card-title text-xl text-gray-900 font-semibold">{job.title}</h3>
                  {job.featured && <div className="badge badge-primary">Featured</div>}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap mt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={16} /> {job.salary}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} /> 4 Days Remaining
                  </span>
                </div>
              </div>

              <div className="card-actions justify-end items-center pr-6">
                <button className="btn btn-primary">Apply Now →</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}