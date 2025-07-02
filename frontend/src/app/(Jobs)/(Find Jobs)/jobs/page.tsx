'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, MapPin, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import JobCard from '@/components/jobs/JobCard';
import JobListItem from '@/components/jobs/JobListItem';
import Pagination from '@/components/jobs/Pagination';
import JobFilterSidebar from '@/components/jobs/JobFilterSidebar';
import { Job } from '@/types';

export default function FindJobPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Will be updated by API
  const [totalJobs, setTotalJobs] = useState(0);   // To display the count

  // Centralized filter state for the entire page
  const [filters, setFilters] = useState({
    jobTitle: '',
    location: '',
    jobType: [] as string[],
    salary: '',
    skills: '',
  });

  // This function now also handles pagination
  const fetchJobs = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError('');

    // Construct the payload including pagination
    const searchPayload: any = {
      page: page,
      limit: 12, // Or however many you want per page
    };

    if (filters.location) searchPayload.location = filters.location;
    if (filters.jobTitle) searchPayload.jobTitle = filters.jobTitle;
    if (filters.salary) searchPayload.salary = filters.salary;
    if (filters.jobType.length > 0) searchPayload.jobType = filters.jobType;
    const skillsArray = filters.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    if (skillsArray.length > 0) searchPayload.skills = skillsArray;

    try {
      const response = await axios.post('http://localhost:3000/jobs', searchPayload);
      
      // --- THIS IS THE FIX ---
      // 1. Extract the 'jobs' array from the response object
      setJobs(response.data.jobs);
      
      // 2. Set the dynamic pagination data from the API response
      setTotalJobs(response.data.totalCount);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);

    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError("Could not load jobs. Please try again later.");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Re-run whenever filters change

  // Fetch jobs when filters or current page changes
  useEffect(() => {
    fetchJobs(currentPage);
  }, [fetchJobs, currentPage]);

  const handleFilterChange = (name: keyof typeof filters, value: string | string[]) => {
    setCurrentPage(1); // Reset to first page when filters change
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTopSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on a new search
    fetchJobs(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="text-sm breadcrumbs mb-4">
          <ul><li><a>Home</a></li><li>Find Job</li></ul>
        </div>

        {/* Top Search Bar */}
        <form onSubmit={handleTopSearch} className="card bg-base-100 shadow-lg p-4 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 flex items-center gap-2">
              <Search className="text-gray-400" />
              <input type="text" placeholder="Job title, Keyword..." value={filters.jobTitle} onChange={e => handleFilterChange('jobTitle', e.target.value)} className="input input-ghost w-full focus:outline-none" />
            </div>
            <div className="md:col-span-5 flex items-center gap-2">
              <MapPin className="text-gray-400" />
              <input type="text" placeholder="Location (e.g., New York)" value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} className="input input-ghost w-full focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? <span className="loading loading-spinner"></span> : 'Search'}
              </button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-12 gap-8">
          {/* Filter Sidebar */}
          <div className={`lg:col-span-3 lg:block ${showFilters ? 'col-span-12 block' : 'hidden'}`}>
            <JobFilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Main Content Area */}
          <div className={`lg:col-span-9 ${showFilters ? 'hidden lg:block' : 'col-span-12'}`}>
            <div className="card bg-white shadow-md p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
              <button onClick={() => setShowFilters(!showFilters)} className="btn btn-primary lg:hidden w-full sm:w-auto">
                <SlidersHorizontal size={16} /> Filter
              </button>
              {/* --- DYNAMIC JOB COUNT --- */}
              <p className="font-semibold">{totalJobs} Jobs Found</p>
              <div className="btn-group">
                <button onClick={() => setViewMode('grid')} className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}><LayoutGrid /></button>
                <button onClick={() => setViewMode('list')} className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}><List /></button>
              </div>
            </div>

            <div className="mt-8">
              {isLoading ? (
                <div className="text-center py-10"><span className="loading loading-spinner loading-lg"></span><p>Searching for jobs...</p></div>
              ) : jobs.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{jobs.map(job => <JobCard key={job.id} job={job as any} />)}</div>
                ) : (
                  <div className="space-y-4">{jobs.map(job => <JobListItem key={job.id} job={job as any} />)}</div>
                )
              ) : (
                <div className="text-center py-10"><p className="text-gray-500">No jobs found. Try adjusting your search criteria.</p></div>
              )}
            </div>
            
            {/* --- DYNAMIC PAGINATION --- */}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      </main>
    </div>
  );
}