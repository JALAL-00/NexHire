'use client';
import { useState, useEffect } from 'react';
// Import the new API function for job recommendations
import { getPosts, createPost } from '@/lib/api/posts';
import { getMyProfile } from '@/lib/api';
import LeftSidebar from '@/components/Orbit/LeftSidebar';
import RightSidebar from '@/components/Orbit/RightSidebar';
import StartPost from '@/components/Orbit/feed/StartPost';
import { User } from '@/types';
import { EngagingPost } from '@/components/Orbit/feed/EngagingPost';
import { JobRecommendationPost } from '@/components/Orbit/feed/JobRecommendationPost';
import { ArticlePost } from '@/components/Orbit/feed/ArticlePost';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function ScrollDashboardPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDashboardData = async () => {
        try {
            // First, get the user's profile to determine their role
            const profileData = await getMyProfile();
            setCurrentUser(profileData);

            // Fetch the regular posts
            const postsData = await getPosts();

            // If you want to keep job recommendations, you must implement and export getJobRecommendations in '@/lib/api/posts'
            // For now, just use postsData
            setPosts(postsData);

        } catch (err) {
            setError('Failed to load dashboard data. Please log in again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCreatePost = async (formData: FormData) => {
        try {
            const newPost = await createPost(formData);
            setPosts(prevPosts => [newPost, ...prevPosts]);
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Could not create post. Please try again.');
        }
    };

    // This dispatcher function correctly handles rendering different post types
    const renderPost = (post: any) => {
        if (post.type === 'JOB_RECOMMENDATION') {
            return <JobRecommendationPost key={post.id} post={post.data} />;
        }
        
        // This part handles standard posts from your API
        const author = post.author;
        if (!author) return null;

        let authorHeadline = 'NexHire User';
        let authorAvatar = '/default-avatar.png';

        if (author.role === 'candidate' && author.candidateProfile) {
            authorHeadline = author.candidateProfile.title || 'Aspiring Professional';
            if (author.candidateProfile.profilePicture) {
                authorAvatar = `${API_URL}/uploads/${author.candidateProfile.profilePicture}`;
            }
        } else if (author.role === 'recruiter' && author.recruiterProfile) {
            authorHeadline = author.recruiterProfile.designation || 'Hiring Professional';
            if (author.recruiterProfile.profilePicture) {
                authorAvatar = `${API_URL}/uploads/${author.recruiterProfile.profilePicture}`;
            }
        }
        
        const formattedPost = {
            id: post.id,
            author: {
                name: `${author.firstName} ${author.lastName}`,
                headline: authorHeadline,
                avatarUrl: authorAvatar,
            },
            content: post.content,
            imageUrl: post.mediaUrl ? `${API_URL}/uploads/${post.mediaUrl}` : undefined,
            likes: post.likes?.length || 0, 
            comments: [],
        };

        return <EngagingPost key={post.id} post={formattedPost} />;
    };
    
    if (isLoading) {
        return <div className="text-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error) {
        return <div className="alert alert-error m-8">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-4 py-8">
                <aside className="md:col-span-3"> <LeftSidebar user={currentUser} /> </aside>
                <main className="md:col-span-6">
                    <StartPost user={currentUser} onPostCreated={handleCreatePost} />
                    <div className="space-y-4"> 
                        {posts.map(post => renderPost(post))} 
                    </div>
                </main>
                <aside className="md:col-span-3"> <RightSidebar /> </aside>
            </div>
        </div>
    );
}