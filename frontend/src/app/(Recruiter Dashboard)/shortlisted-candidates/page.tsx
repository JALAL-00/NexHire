'use client';

import { useState, useEffect } from 'react';
import { getShortlistedApplications } from '@/lib/api/applications';
import { ShortlistedCard } from '@/components/recruiter-dashboard/ShortlistedCard';
import { Star } from 'lucide-react';

export default function ShortlistedCandidatesPage() {
  const [shortlisted, setShortlisted] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShortlisted = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getShortlistedApplications();
        setShortlisted(data);
      } catch (err) {
        setError('Failed to load shortlisted candidates.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShortlisted();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }
    if (error) {
      return <div className="alert alert-error">{error}</div>;
    }
    if (shortlisted.length === 0) {
      return (
        <div className="text-center py-20 bg-base-200 rounded-lg">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Shortlisted Candidates</h3>
          <p className="mt-1 text-sm text-gray-500">
            When you accept an applicant, they will appear here.
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shortlisted.map(application => (
          <ShortlistedCard key={application.id} application={application} />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Shortlisted Candidates</h1>
        <p className="text-gray-500 mb-8">
          These are candidates you've accepted for an interview.
        </p>
        {renderContent()}
      </div>
    </div>
  );
}