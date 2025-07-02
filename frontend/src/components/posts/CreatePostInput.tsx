'use client';

import { Image as ImageIcon, Video, FileText } from 'lucide-react';

// Define the post types here for clarity
export type PostType = 'post' | 'image' | 'video' | 'article';

interface CreatePostInputProps {
  profilePic: string;
  // --- THIS IS THE FIX (Part 1) ---
  // The prop now accepts the type of post to create.
  onOpenModal: (type: PostType) => void;
}

export default function CreatePostInput({ profilePic, onOpenModal }: CreatePostInputProps) {
  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm mb-6">
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={profilePic} alt="User" onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }} />
          </div>
        </div>
        {/* --- THIS IS THE FIX (Part 2) --- */}
        {/* Each button now calls onOpenModal with a specific type argument. */}
        <button 
          onClick={() => onOpenModal('post')}
          className="input input-bordered w-full text-left text-gray-500 hover:bg-gray-100"
        >
          Start a post
        </button>
      </div>
      <div className="divider my-3"></div>
      <div className="flex justify-around">
        <button onClick={() => onOpenModal('image')} className="btn btn-ghost text-gray-600">
          <ImageIcon className="text-blue-500" />
          Photo
        </button>
        <button onClick={() => onOpenModal('video')} className="btn btn-ghost text-gray-600">
          <Video className="text-green-500" />
          Video
        </button>
        <button onClick={() => onOpenModal('article')} className="btn btn-ghost text-gray-600">
          <FileText className="text-orange-500" />
          Article
        </button>
      </div>
    </div>
  );
}