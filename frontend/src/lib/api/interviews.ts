import { apiClient } from '../api';

export interface CreateInterviewPayload {
  applicationId: number;
  title: string;
  date: string; // ISO 8601 format (e.g., new Date().toISOString())
  type: 'Video Call' | 'Phone Screen' | 'On-site';
  locationOrLink?: string;
  notes?: string;
}

export const createInterview = async (payload: CreateInterviewPayload): Promise<any> => {
  const response = await apiClient.post('/interviews', payload);
  return response.data;
};

export const getInterviews = async (): Promise<any[]> => {
  const response = await apiClient.get('/interviews');
  return response.data;
};