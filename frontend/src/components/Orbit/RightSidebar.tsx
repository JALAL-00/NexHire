'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { getFollowRecommendations } from '@/lib/api/users'; // Import our new API function
import { User } from '@/types'; // Assuming a User type exists

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const RightSidebar = () => {
    // State to hold the recommended users
    const [recommendations, setRecommendations] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            setIsLoading(true);
            try {
                // Fetch 3 recommendations from the API
                const users = await getFollowRecommendations(3); 
                setRecommendations(users);
            } catch (error) {
                console.error("Could not load recommendations", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    // Helper function to get the correct headline for a user
    const renderHeadline = (user: User) => {
        if (user.role === 'candidate' && user.candidateProfile) {
            return user.candidateProfile.title || 'Aspiring Professional';
        } else if (user.role === 'recruiter' && user.recruiterProfile) {
            return user.recruiterProfile.designation || 'Hiring Professional';
        }
        return 'NexHire User';
    };
    
    // Helper function to get the correct avatar URL
    const renderAvatar = (user: User) => {
        let avatarPath = null;
        if (user.role === 'candidate' && user.candidateProfile) {
            avatarPath = user.candidateProfile.profilePicture;
        } else if (user.role === 'recruiter' && user.recruiterProfile) {
            avatarPath = user.recruiterProfile.profilePicture;
        }
        return avatarPath ? `${API_URL}/uploads/${avatarPath}` : '/default-avatar.png';
    }

    return (
        <div className="space-y-4 hidden lg:block">
            {/* "Who to Follow" Card */}
            <div className="card w-full bg-base-100 shadow-md border border-gray-200">
                <div className="card-body p-4">
                    <h2 className="card-title text-base mb-2">Who to Follow</h2>
                    <div className="space-y-4">
                        {isLoading ? (
                            // Display a loading skeleton for better UX
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex items-center gap-3 animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Display the actual recommended users
                            recommendations.map(user => (
                                <div key={user.id} className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="w-10 rounded-full">
                                            <img 
                                                src={renderAvatar(user)}
                                                alt={`${user.firstName} ${user.lastName}`} 
                                                onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-sm leading-tight truncate">{`${user.firstName} ${user.lastName}`}</p>
                                        <p className="text-xs text-gray-500 truncate">{renderHeadline(user)}</p>
                                    </div>
                                    <button className="btn btn-sm btn-outline btn-primary">
                                        <Plus size={16} /> Follow
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* "Trending Topics" Card */}
            <div className="card w-full bg-base-100 shadow-md border border-gray-200">
                <div className="card-body p-4">
                    <h2 className="card-title text-base">Trending Topics</h2>
                    <ul className="menu bg-base-100 w-full rounded-box p-0 text-sm">
                        <li><a className="font-semibold text-gray-600 hover:text-primary p-2">#JavaScript</a></li>
                        <li><a className="font-semibold text-gray-600 hover:text-primary p-2">#React</a></li>
                        <li><a className="font-semibold text-gray-600 hover:text-primary p-2">#Hiring</a></li>
                        <li><a className="font-semibold text-gray-600 hover:text-primary p-2">#RemoteWork</a></li>
                    </ul>
                    <button className="btn btn-ghost btn-sm mt-2 text-primary self-start">Show more</button>
                </div>
            </div>
        </div>
    );
}

export default RightSidebar;