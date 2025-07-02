// frontend/src/lib/api/users.ts
import { apiClient } from "../api"; 
import { User } from "@/types"; // Make sure you have a User type defined

/**
 * Fetches recommended users, defaulting to candidates.
 * @param limit - The number of users to fetch.
 * @returns An array of user objects.
 */
export const getFollowRecommendations = async (limit: number = 3): Promise<User[]> => {
  try {
    // The backend should ideally filter by role=candidate for recommendations on a job platform
    const response = await apiClient.get(`/users/recommendations?limit=${limit}&role=candidate`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch follow recommendations:', error);
    return [];
  }
};

/**
 * NEW FUNCTION: Fetches all users with the 'candidate' role.
 * @returns An array of all candidate user objects.
 */
export const getAllCandidates = async (): Promise<User[]> => {
    try {
        const response = await apiClient.get('/users/candidates');
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch all candidates:', error);
        return [];
    }
};

/**
 * Fetches a single user's public profile by their ID.
 * @param userId The ID of the user to fetch.
 * @returns A single user object.
 */
export const getUserProfileById = async (userId: string | number): Promise<User> => {
    try {
        const response = await apiClient.get(`/users/profile/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch profile for user ${userId}:`, error);
        throw error; // Re-throw the error to be handled by the component
    }
};