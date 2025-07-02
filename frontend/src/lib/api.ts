import axios from 'axios';
import Cookies from 'js-cookie';
import { ScreeningResult } from '@/types/screening';
import { Applicant, Job } from '@/types'; // Import Applicant type

// --- API CLIENT SETUP ---

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor to automatically attach the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- USER & PROFILE ---

export interface UpdateUserInfoPayload {
  firstName?: string;
  lastName?: string;
  title?: string;
  location?: string;
  about?: string;
  services?: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  availability?: string;
  companyName?: string;
  designation?: string;
  phone?: string;
  website?: string;
}

export interface RecruiterStats {
  totalJobs: number;
  totalApplicants: number;
  totalShortlisted: number;
  totalInterviews: number;
}

export const getMyProfile = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw new Error('Could not load your profile. Please ensure you are logged in.');
  }
};

export const updateMyUserInfo = async (payload: UpdateUserInfoPayload): Promise<any> => {
  try {
    const response = await apiClient.patch('/auth/me', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Failed to save changes.');
    }
    console.error('Failed to update profile:', error);
    throw new Error('An unexpected error occurred while saving your profile.');
  }
};

export const uploadProfileImage = async (
  file: File,
  imageType: 'profilePicture' | 'coverPhoto'
): Promise<{ filePath: string }> => {
  // This function is fine as is
  const formData = new FormData();
  formData.append('file', file);
  const url = imageType === 'profilePicture' ? '/auth/upload-profile-picture' : '/auth/upload-cover-photo';
  try {
    const response = await apiClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  } catch (error) {
    console.error(`Failed to upload ${imageType}:`, error);
    throw new Error(`Failed to upload ${imageType}. Please try again.`);
  }
};

// --- JOBS ---

export interface SimpleJob {
  id: number;
  title: string;
}

export const getJobRecommendations = async (limit: number = 2): Promise<any[]> => {
  try {
    const response = await apiClient.get(`/jobs/recommendations?limit=${limit}`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch job recommendations:', error);
    return [];
  }
};

export const getRecruiterJobs = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get('/recruiter/jobs/all');
    return response.data || []; 
  } catch (error) {
    console.error('Failed to fetch jobs:', error);
    throw new Error('Could not fetch jobs. Please ensure you are logged in.');
  }
};

// --- APPLICATIONS ---

export const getRecentApplicants = async (): Promise<Applicant[]> => {
  try {
    const response = await apiClient.get('/applications/recent');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recent applicants:", error);
    throw new Error("Could not load recent applicants.");
  }
};

export const getShortlistedApplications = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get('/applications/shortlisted');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shortlisted applications:", error);
    throw new Error("Could not load shortlisted applications.");
  }
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: 'pending' | 'accepted' | 'rejected'
): Promise<any> => {
  try {
    const response = await apiClient.patch('/applications/status', { applicationId, status });
    return response.data;
  } catch (error)
  {
    console.error('Failed to update application status:', error);
    throw new Error('Could not update the application status.');
  }
};

// --- SCREENING ---

export const screenJobResumes = async (jobId: number): Promise<ScreeningResult[]> => {
  try {
    const response = await apiClient.post<ScreeningResult[]>('/screening/job', { jobId });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Screening failed. No applications may exist for this job.');
    }
    console.error('Failed to screen resumes:', error);
    throw new Error('An unexpected error occurred during screening.');
  }
};

// --- INTERVIEWS ---

export interface CreateInterviewPayload {
  applicationId: number;
  title: string;
  date: string; // ISO 8601 format
  type: 'Video Call' | 'Phone Screen' | 'On-site';
  locationOrLink?: string;
  notes?: string;
}

export const createInterview = async (payload: CreateInterviewPayload): Promise<any> => {
  const response = await apiClient.post('/interviews', payload);
  return response.data;
};

// ... (at the end of the file, with other interview functions)

export const deleteInterview = async (interviewId: number): Promise<void> => {
  try {
    await apiClient.delete(`/interviews/${interviewId}`);
  } catch (error) {
    console.error('Failed to delete interview:', error);
    throw new Error('Could not delete the interview. Please try again.');
  }
};

export const getInterviews = async (): Promise<any[]> => {
  const response = await apiClient.get('/interviews');
  return response.data;
};

// --- CHAT ---

export const getChatUsers = async (): Promise<any[]> => {
  const response = await apiClient.get('/chat/users');
  return response.data;
};

export const getOrCreateConversation = async (recipientId: number): Promise<any> => {
  const response = await apiClient.post('/chat/conversations', { recipientId });
  return response.data;
};

export const getMessageHistory = async (conversationId: number): Promise<any[]> => {
  const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
  return response.data;
};


export const getRecruiterStats = async (): Promise<RecruiterStats> => {
  try {
    const response = await apiClient.get('/recruiter/dashboard-stats');
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recruiter stats:", error);
    throw new Error("Could not load dashboard statistics.");
  }
};

// ... (keep all existing functions)

// --- ADD THESE FUNCTIONS FOR SAVED JOBS ---

export const getSavedJobs = async (): Promise<Job[]> => {
  try {
    const response = await apiClient.get<Job[]>('/candidate/saved-jobs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch saved jobs:', error);
    throw new Error('Could not load your saved jobs.');
  }
};

export const saveJob = async (jobId: number): Promise<any> => {
  try {
    const response = await apiClient.post(`/candidate/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to save job:', error);
    throw new Error('Could not save this job.');
  }
};

export const unsaveJob = async (jobId: number): Promise<any> => {
  try {
    const response = await apiClient.delete(`/candidate/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to unsave job:', error);
    throw new Error('Could not remove this job from your saved list.');
  }
};

// ... (at the end of the file)
export const uploadChatFile = async (file: File): Promise<{ filePath: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await apiClient.post('/chat/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload chat file:', error);
    throw new Error('File upload failed. Please try again.');
  }
};