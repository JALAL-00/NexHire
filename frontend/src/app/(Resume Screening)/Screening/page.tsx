'use client';

import React, { useState, useEffect } from 'react';
import { getRecruiterJobs, screenJobResumes } from '@/lib/api';
import { SimpleJob, ScreeningResult } from '@/types/screening';
import ScreeningResultsTable from '@/components/Screening/ScreeningResultsTable';
import { ScanSearch } from 'lucide-react';

export default function ScreeningPage() {
  const [jobs, setJobs] = useState<SimpleJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [results, setResults] = useState<ScreeningResult[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingJobs, setIsFetchingJobs] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentJobTitle, setCurrentJobTitle] = useState<string>('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setError(null);
        const response: SimpleJob[] | { jobs: SimpleJob[] } = await getRecruiterJobs();

        // Ensure we extract 'jobs' from the response if wrapped
        const fetchedJobs = Array.isArray(response)
          ? response
          : (response as { jobs: SimpleJob[] }).jobs ?? [];

        setJobs(fetchedJobs);
      } catch (err: any) {
        setError(err.message || 'Failed to load jobs.');
      } finally {
        setIsFetchingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  const handleScreenResumes = async () => {
    if (!selectedJobId) {
      setError('Please select a job to screen.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    const jobTitle = jobs.find(j => j.id === Number(selectedJobId))?.title || '';
    setCurrentJobTitle(jobTitle);

    try {
      const screeningResults = await screenJobResumes(Number(selectedJobId));
      setResults(screeningResults);
    } catch (err: any) {
      setError(err.message || 'Failed to screen resumes.');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-base-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="container mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Batch Resume Screening</h1>
          <p className="mt-2 text-md text-gray-500">
            Select a job to automatically screen all its applicants against the job description.
          </p>
        </header>

        <div className="card bg-base-200 shadow-xl p-6">
          <div className="card-body p-0">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Select a Job Posting</span>
              </label>
              {isFetchingJobs ? (
                <div className="skeleton h-12 w-full"></div>
              ) : (
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    setError(null);
                    setResults(null);
                  }}
                  className="select select-bordered w-full"
                  disabled={jobs.length === 0}
                >
                  <option value="" disabled>
                    {jobs.length > 0 ? 'Pick one...' : 'No jobs found to screen'}
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="card-actions justify-end mt-4">
              <button
                type="button"
                onClick={handleScreenResumes}
                disabled={!selectedJobId || isLoading || isFetchingJobs}
                className="btn btn-primary"
              >
                <ScanSearch size={18} />
                {isLoading ? 'Screening...' : 'Screen Resumes'}
              </button>
            </div>
          </div>
        </div>

        {error && <div className="mt-4 alert alert-error">{error}</div>}

        {isLoading && (
          <div className="mt-8 text-center">
            <p>
              Screening applicants for <strong>{currentJobTitle}</strong>...
            </p>
            <span className="loading loading-dots loading-lg"></span>
          </div>
        )}

        {results && <ScreeningResultsTable results={results} />}
      </main>
    </div>
  );
}
