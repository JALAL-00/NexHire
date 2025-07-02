// frontend/src/lib/api/applications.ts
import { apiClient } from '../api'; // Adjust path as needed
import { Applicant } from '@/types'; // Assuming you have a detailed Application type

// --- ADD THIS NEW FUNCTION ---
/**
 * Fetches the most recent applicants for the logged-in recruiter.
 * @returns A promise that resolves to an array of recent applications.
 */
export const getRecentApplicants = async (): Promise<Applicant[]> => {
  try {
    const response = await apiClient.get('/applications/recent');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recent applicants:", error);
    throw new Error("Could not load recent applicants.");
  }
};

/**
 * Fetches all shortlisted (accepted) applications for the logged-in recruiter.
 * @returns A promise that resolves to an array of applications.
 */
export const getShortlistedApplications = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get('/applications/shortlisted');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shortlisted applications:", error);
    throw new Error("Could not load shortlisted applications.");
  }
};