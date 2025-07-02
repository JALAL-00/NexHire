// frontend/src/components/Orbit/LeftSidebar.tsx
'use client';
import { User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface LeftSidebarProps {
  user: User | null;
}

const LeftSidebar = ({ user }: LeftSidebarProps) => {
    if (!user) {
        return (
            <div className="card w-full bg-base-100 shadow-md border border-gray-200 hidden lg:block animate-pulse">
                <div className="card-body">
                    <div className="flex flex-col items-center text-center">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="h-6 w-3/4 bg-gray-300 rounded mt-4"></div>
                        <div className="h-4 w-1/2 bg-gray-300 rounded mt-2"></div>
                    </div>
                </div>
            </div>
        );
    }

    const name = `${user.firstName} ${user.lastName}`;
    let headline = 'NexHire User';
    let avatarUrl = '/default-avatar.png'; // Default fallback

    // --- THIS IS THE FIX ---
    // The URL now correctly includes the '/uploads' path segment
    if (user.role === 'candidate' && user.candidateProfile) {
        headline = user.candidateProfile.title || 'Aspiring Professional';
        if (user.candidateProfile.profilePicture) {
            avatarUrl = `${API_URL}/uploads/${user.candidateProfile.profilePicture}`;
        }
    } else if (user.role === 'recruiter' && user.recruiterProfile) {
        headline = user.recruiterProfile.designation || 'Hiring Professional';
        if (user.recruiterProfile.profilePicture) {
            avatarUrl = `${API_URL}/uploads/${user.recruiterProfile.profilePicture}`;
        }
    }
    // ----------------------

    return (
        <div className="card w-full bg-base-100 shadow-md border border-gray-200 hidden lg:block">
            <div className="card-body">
                <div className="flex flex-col items-center text-center">
                    <div className="avatar">
                        <div className="w-24 rounded-full ring-2 ring-primary ring-offset-2">
                            <img 
                                src={avatarUrl} 
                                alt={name} 
                                // Add an error handler to show the default avatar if the link is broken
                                onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
                            />
                        </div>
                    </div>
                    <h2 className="card-title mt-4">{name}</h2>
                    <p className="text-sm text-gray-500">{headline}</p>
                </div>
                <div className="divider"></div>
                <ul className="menu bg-base-100 w-full rounded-box">
                    <li><a>Connections</a></li>
                    <li><a>My Network</a></li>
                    <li><a>Groups</a></li>
                </ul>
            </div>
        </div>
    );
}
export default LeftSidebar;