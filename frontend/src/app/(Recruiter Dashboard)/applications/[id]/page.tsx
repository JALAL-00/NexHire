'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { PlusCircle, ScanSearch } from 'lucide-react';
import { ApplicationColumn } from '@/components/applications/ApplicationColumn';
import { AddColumnModal } from '@/components/applications/AddColumnModal';
import { ApplicantDetailModal } from '@/components/applications/ApplicantDetailModal';
import { Applicant, FullApplicantDetails } from '@/types';
import { screenJobResumes, updateApplicationStatus } from '@/lib/api';
import { ScreeningResult } from '@/types/screening';
import ScreeningResultsModal from '@/components/applications/ScreeningResultsModal';

// Defines the expected structure of the API response for an application
interface ApplicationResponse {
  id: number;
  status: string;
  createdAt: string;
  candidate: {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    candidateProfile?: {
      title?: string;
      experience?: { title: string; org: string; }[]; 
      education?: { degree: string; institution: string; }[];
      about?: string;
      biography?: string;
      profilePicture?: string | null; // Make sure this is here
    };
    resume?: string | null;
  };
  job: {
    title: string;
  };
}

// Defines the structure for a Kanban column
interface Column {
  id: string;
  title: string;
  applicants: Applicant[];
}

export default function JobApplicationsPage() {
  const params = useParams();
  const jobId = params.id as string;

  // ... (all other state and functions remain the same) ...
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<FullApplicantDetails | null>(null);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningError, setScreeningError] = useState<string | null>(null);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[] | null>(null);

  const fetchApplications = useCallback(async () => {
    // ... (fetch logic remains the same) ...
    if (!jobId) {
      setError("Job ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    const token = Cookies.get('auth_token');
    if (!token) {
      setError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/applications/job/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to fetch applications');
      
      const applications: ApplicationResponse[] = await response.json();

      if (applications.length > 0) {
        setJobTitle(applications[0].job.title);
      } else {
         const jobResponse = await fetch(`http://localhost:3000/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
         if(jobResponse.ok) {
            const jobData = await jobResponse.json();
            setJobTitle(jobData.title || 'Job Applications');
         } else {
            setJobTitle('Job Applications');
         }
      }

      const columnsMap: Map<string, Applicant[]> = new Map([
        ['pending', []], ['accepted', []], ['rejected', []],
      ]);

      applications.forEach(app => {
        const mostRecentExp = app.candidate.candidateProfile?.experience?.[0];
        const experienceString = mostRecentExp ? `${mostRecentExp.title} at ${mostRecentExp.org}` : 'N/A';
        const mostRecentEdu = app.candidate.candidateProfile?.education?.[0];
        const educationString = mostRecentEdu ? `${mostRecentEdu.degree}, ${mostRecentEdu.institution}` : 'N/A';

        const applicant: Applicant = {
          id: app.id,
          candidateId: app.candidate.id, 
          name: `${app.candidate.firstName || ''} ${app.candidate.lastName || ''}`.trim(),
          title: app.candidate.candidateProfile?.title || 'N/A',
          // --- THIS IS THE ONLY CHANGE IN THIS FILE ---
          avatarUrl: app.candidate.candidateProfile?.profilePicture ?? undefined, // Pass the image path, ensure no null
          experience: experienceString,
          education: educationString,
          appliedDate: new Date(app.createdAt).toLocaleDateString(),
          resume: app.candidate.resume || null,
          fullDetails: { 
            applicationId: app.id, 
            status: app.status, 
            candidate: app.candidate as any 
          },
        };
        
        const status = app.status || 'pending';
        if (!columnsMap.has(status)) { columnsMap.set(status, []); }
        columnsMap.get(status)?.push(applicant);
      });

      const newColumns: Column[] = [
        { id: 'pending', title: 'Pending', applicants: columnsMap.get('pending') || [] },
        { id: 'accepted', title: 'Interview', applicants: columnsMap.get('accepted') || [] },
        { id: 'rejected', title: 'Rejected', applicants: columnsMap.get('rejected') || [] },
      ];
      setColumns(newColumns);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError("Could not load applications. Please ensure the job exists and you have permission.");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  // ... (rest of the component remains exactly the same) ...
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCardClick = (applicant: Applicant) => { setSelectedApplicant(applicant.fullDetails); };

  const handleDownloadCV = (e: React.MouseEvent, resumePath: string | null) => {
    e.stopPropagation();
    if (resumePath) {
      const resumeUrl = `http://localhost:3000/${resumePath}`;
      window.open(resumeUrl, '_blank');
    } else {
      alert("No resume available for this candidate.");
    }
  };
  
  const handleUpdateStatus = async (applicationId: number, newStatus: 'pending' | 'accepted' | 'rejected') => {
    try {
        await updateApplicationStatus(applicationId, newStatus);
        fetchApplications(); 
        setSelectedApplicant(null);
    } catch (apiError) {
        console.error(apiError);
        alert('Failed to update status. Please try again.');
    }
  };
  
  const handleScreenAllResumes = async () => {
    setIsScreening(true);
    setScreeningError(null);
    setScreeningResults(null);

    try {
      const results = await screenJobResumes(Number(jobId));
      setScreeningResults(results);
    } catch (err: any) {
      setScreeningError(err.message || 'An unknown error occurred during screening.');
      setScreeningResults([]);
    } finally {
      setIsScreening(false);
    }
  };
  
  const handleAddColumn = (columnName: string) => {
    const newColumn: Column = {
      id: columnName.toLowerCase().replace(/\s+/g, '-'),
      title: columnName,
      applicants: [],
    };
    setColumns(prevColumns => [...prevColumns, newColumn]);
  };

  return (
    <>
      <div className="bg-base-100 min-h-screen p-4 sm:p-6 lg:p-8">
        <main className="container mx-auto">
          <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
            <div>
              <div className="text-sm breadcrumbs">
                <ul>
                  <li><Link href="/recruiter-dashboard">Home</Link></li>
                  <li><Link href="/manage-jobs">My Jobs</Link></li>
                  <li>{jobTitle || 'Job'}</li>
                  <li>Applications</li>
                </ul>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mt-2">{jobTitle}</h1>
              <p className="text-gray-500">Manage applicants for this position.</p>
            </div>
            <div>
              <button className="btn btn-primary" onClick={handleScreenAllResumes} disabled={isScreening || isLoading || columns.flatMap(c => c.applicants).length === 0}>
                <ScanSearch size={18} />
                {isScreening ? "Screening..." : "Screen All Resumes"}
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
          ) : error ? (
            <div className="alert alert-error">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
              {columns.map(column => (
                <ApplicationColumn 
                  key={column.id}
                  title={column.title}
                  count={column.applicants.length}
                  applicants={column.applicants}
                  onCardClick={handleCardClick}
                  onDownloadCV={handleDownloadCV}
                />
              ))}
              <div className="w-full">
                <button onClick={() => setIsAddColumnModalOpen(true)} className="btn btn-ghost w-full border-2 border-dashed border-gray-300 h-16">
                  <PlusCircle size={20} /> Create New Column
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {isAddColumnModalOpen && <AddColumnModal onClose={() => setIsAddColumnModalOpen(false)} onAddColumn={handleAddColumn}/>}

      {selectedApplicant && (
        <ApplicantDetailModal 
          applicant={selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onDownloadCV={(e) => handleDownloadCV(e, selectedApplicant.candidate.resume)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {screeningResults !== null && <ScreeningResultsModal isLoading={isScreening} error={screeningError} results={screeningResults} onClose={() => setScreeningResults(null)} />}
    </>
  );
}