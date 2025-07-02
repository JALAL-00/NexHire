'use client';

import { useState, useEffect, useMemo } from 'react';
import { User } from '@/types';
import { getAllCandidates } from '@/lib/api/users';
import { Mail, MapPin, Briefcase, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// A reusable candidate card component
const CandidateCard = ({ candidate }: { candidate: User }) => {
    const profile = candidate.candidateProfile;
    const avatarUrl = profile?.profilePicture
        ? `${API_URL}/uploads/${profile.profilePicture}`
        : '/default-avatar.png';

    return (
        <div className="card bg-base-100 shadow-lg border transition-transform duration-300 hover:-translate-y-1">
            <div className="card-body items-center text-center p-6">
                <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <Image src={avatarUrl} width={96} height={96} alt={`${candidate.firstName} ${candidate.lastName}`} />
                    </div>
                </div>
                <h2 className="card-title mt-4">{`${candidate.firstName} ${candidate.lastName}`}</h2>
                <p className="text-primary font-semibold">{profile?.title || 'No Title'}</p>
                
                <div className="text-left space-y-2 mt-4 text-sm text-gray-600 self-start w-full">
                    {/* This line will now work correctly */}
                    <p className="flex items-center gap-2 truncate"><MapPin size={14} /> {profile?.location || 'Not specified'}</p>
                    <p className="flex items-center gap-2 truncate"><Mail size={14} /> {candidate.email}</p>
                </div>
                
                <div className="card-actions mt-4 w-full">
                    {/* This link should go to a public profile page for the candidate */}
                    <Link href={`/profiles/${candidate.id}`} className="btn btn-primary btn-block">
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default function FindCandidatePage() {
    const [candidates, setCandidates] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCandidates = async () => {
            setIsLoading(true);
            try {
                const data = await getAllCandidates();
                setCandidates(data);
            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCandidates();
    }, []);

    // Memoize the filtered results to avoid re-calculating on every render
    const filteredCandidates = useMemo(() => {
        if (!searchTerm) return candidates;
        
        return candidates.filter(c => {
            const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
            const title = c.candidateProfile?.title?.toLowerCase() || '';
            // This line will also work correctly now
            const location = c.candidateProfile?.location?.toLowerCase() || '';
            const term = searchTerm.toLowerCase();

            return fullName.includes(term) || title.includes(term) || location.includes(term);
        });
    }, [searchTerm, candidates]);

    if (isLoading) {
        return <div className="p-8 text-center"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Find Candidates</h1>
                <p className="text-gray-500 mb-6">Browse all registered candidates on the platform.</p>

                {/* Search Input */}
                <div className="form-control mb-8 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, title, or location..."
                        className="input input-bordered w-full pl-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Candidates Grid */}
                {filteredCandidates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCandidates.map(candidate => (
                            <CandidateCard key={candidate.id} candidate={candidate} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-base-100 rounded-lg">
                        <p className="font-semibold">No candidates found.</p>
                        <p className="text-sm text-gray-500">Try adjusting your search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
}