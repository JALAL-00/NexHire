// frontend/src/components/Orbit/feed/StartPost.tsx
'use client';
import { useState, useRef } from 'react';
import { Image as ImageIcon, Video, FileText, Paperclip, X } from 'lucide-react';
import { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface StartPostProps {
  user: User | null;
  onPostCreated: (formData: FormData) => void;
}

const StartPost = ({ user, onPostCreated }: StartPostProps) => {
  const [postText, setPostText] = useState('');
  const [postFile, setPostFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  let avatarUrl = '/default-avatar.png';
  if (user.role === 'candidate' && user.candidateProfile?.profilePicture) {
    avatarUrl = `${API_URL}/uploads/${user.candidateProfile.profilePicture}`;
  } else if (user.role === 'recruiter' && user.recruiterProfile?.profilePicture) {
    avatarUrl = `${API_URL}/uploads/${user.recruiterProfile.profilePicture}`;
  }

  const openModal = () => {
    const modal = document.getElementById('create_post_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById('create_post_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  const handlePostSubmit = () => {
    // FIX 1: The button is now enabled if there's text OR a file.
    if (!postText.trim() && !postFile) return;

    const formData = new FormData();
    formData.append('content', postText);
    if (postFile) {
      formData.append('file', postFile);
    }

    onPostCreated(formData);
    
    // Reset state and close modal
    setPostText('');
    setPostFile(null);
    closeModal();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPostFile(event.target.files[0]);
      // FIX 2: Open the modal automatically when a file is chosen from the main component.
      openModal();
    }
  };
  
  const triggerFileInput = () => {
      fileInputRef.current?.click();
  };

  return (
    <>
      {/* Main Component Body */}
      <div className="card w-full bg-base-100 shadow-md border border-gray-200 rounded-lg mb-4 p-4">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="w-12 rounded-full">
              <img 
                src={avatarUrl} 
                alt="User Avatar" 
                onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
              />
            </div>
          </div>
          <button className="input input-bordered flex-grow text-left pl-4 text-gray-500" onClick={openModal}>
            Start a post
          </button>
        </div>
        <div className="flex justify-around mt-4 pt-2 border-t">
          <button className="btn btn-ghost btn-sm flex-1" onClick={triggerFileInput}>
            <ImageIcon size={20} className="text-blue-500" /> Photo
          </button>
           {/* You can add more buttons here that trigger the same file input */}
        </div>
      </div>

      {/* The Modal */}
      <dialog id="create_post_modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Create a Post</h3>
            <button onClick={closeModal} className="btn btn-sm btn-circle btn-ghost">✕</button>
          </div>
          
          <div className="py-4">
            <textarea
              className="textarea textarea-bordered w-full h-40"
              placeholder="What do you want to talk about?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>

            {/* FIX 3: File preview inside the modal */}
            {postFile && (
                <div className="mt-4 p-2 bg-gray-100 rounded-lg flex items-center justify-between gap-2 border">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip size={16} className="text-gray-600 flex-shrink-0" />
                        <span className="truncate text-sm">{postFile.name}</span>
                    </div>
                    <button onClick={() => setPostFile(null)} className="btn btn-xs btn-circle btn-ghost">
                        <X size={14}/>
                    </button>
                </div>
            )}
          </div>
          
          {/* FIX 4: Action buttons are now INSIDE the modal */}
          <div className="flex items-center gap-2 mb-4 border-t pt-4">
            <button className="btn btn-sm btn-ghost" onClick={triggerFileInput}><ImageIcon size={20}/></button>
            <button className="btn btn-sm btn-ghost" onClick={triggerFileInput}><Video size={20}/></button>
            <button className="btn btn-sm btn-ghost" onClick={triggerFileInput}><FileText size={20}/></button>
          </div>

          <div className="modal-action mt-0">
            {/* The disabled logic is now corrected */}
            <button 
                className="btn btn-primary" 
                onClick={handlePostSubmit} 
                disabled={!postText.trim() && !postFile}
            >
                Post
            </button>
          </div>
        </div>
        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop"><button onClick={closeModal}>close</button></form>
        {/* Hidden file input that gets triggered */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      </dialog>
    </>
  );
};

export default StartPost;