// frontend/src/lib/api/posts.ts
import Cookies from 'js-cookie';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthHeader = (includeContentType = true) => {
    const token = Cookies.get('auth_token');
    if (!token) throw new Error('No auth token found');
    const headers: any = { 'Authorization': `Bearer ${token}` };
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

export const getPosts = async () => {
    const response = await fetch(`${API_URL}/posts`, {
        headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
};

export const getPostsByUser = async (userId: number) => {
    const response = await fetch(`${API_URL}/posts/user/${userId}`, {
        headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return response.json();
};

export const createPost = async (formData: FormData) => {
    const token = Cookies.get('auth_token');
    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type' is set automatically by the browser for FormData
        },
        body: formData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
    }
    return response.json();
};

export const updatePost = async (postId: number, content: string) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify({ content }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update post');
    }
    return response.json();
};

// New function to delete a post
export const deletePost = async (postId: number) => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeader(false), // No content-type needed for DELETE
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete post');
    }
    // DELETE requests often return no content, so we don't .json() it
    return { success: true };
};