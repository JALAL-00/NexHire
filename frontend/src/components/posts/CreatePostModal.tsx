'use client';

import { useState, useMemo, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import { X, Image as ImageIcon, Video, FileText, Send } from 'lucide-react';
// Import both create and update functions from your API library
import { createPost, updatePost } from '@/lib/api/posts';
import { PostType } from './CreatePostInput'; // Assuming this type is exported from CreatePostInput

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreatedOrUpdated: (post: any) => void;
  postToEdit?: any | null;
  initialPostType?: PostType;
}

export default function CreatePostModal({
  onClose,
  onPostCreatedOrUpdated,
  postToEdit,
  initialPostType = 'post',
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const isEditing = !!postToEdit;
  const fileInputRef = useRef<HTMLInputElement>(null); // Use a single ref like in StartPost.tsx

  useEffect(() => {
    if (isEditing && postToEdit) {
      setContent(postToEdit.content);
    }
  }, [isEditing, postToEdit]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- THIS IS THE FIX ---
  // The submit handler now correctly uses FormData for creation.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) {
      setError('You must add content or a file to your post.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      let result;
      if (isEditing) {
        // Update logic remains the same (no file change on edit)
        result = await updatePost(postToEdit.id, content);
      } else {
        // Create logic now correctly uses FormData
        const formData = new FormData();
        formData.append('content', content);
        if (mediaFile) {
          // The backend expects the file under the key 'file', not 'media'
          // as seen in the posts.controller.ts FileInterceptor('file', ...).
          formData.append('file', mediaFile);
        }
        result = await createPost(formData);
      }
      onPostCreatedOrUpdated(result);
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} post.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const placeholderText = useMemo(() => {
    if (mediaFile) return "Add a description for your media...";
    return "What do you want to talk about?";
  }, [mediaFile]);

  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-lg">{isEditing ? 'Edit Post' : 'Create a Post'}</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="py-4">
          <textarea
            className="textarea textarea-bordered w-full h-40"
            placeholder={placeholderText}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
          
          {/* File preview section, similar to StartPost */}
          {mediaFile && !isEditing && (
            <div className="mt-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between gap-2 border">
              <span className="truncate text-sm font-medium">{mediaFile.name}</span>
              <button onClick={() => setMediaFile(null)} type="button" className="btn btn-xs btn-circle btn-ghost">
                <X size={14}/>
              </button>
            </div>
          )}

          {/* Action buttons are simplified and only appear when not editing */}
          {!isEditing && (
            <div className="flex items-center gap-2 mt-4">
                <button type="button" onClick={triggerFileInput} className="btn btn-sm btn-ghost"><ImageIcon size={20}/> Photo</button>
                <button type="button" onClick={triggerFileInput} className="btn btn-sm btn-ghost"><Video size={20}/> Video</button>
                <button type="button" onClick={triggerFileInput} className="btn btn-sm btn-ghost"><FileText size={20}/> Article</button>
            </div>
          )}
          
          {error && <p className="text-error text-sm mt-4">{error}</p>}

          <div className="modal-action mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost" disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting || (!content.trim() && !mediaFile)}>
              {isSubmitting ? <span className="loading loading-spinner" /> : <>{isEditing ? 'Save Changes' : 'Post'}</>}
            </button>
          </div>
        </form>
      </div>
      {/* Hidden file input that gets triggered */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        // Allow all types since the backend determines the PostType from MIME
        accept="image/*,video/*,.pdf,.doc,.docx" 
      />
    </dialog>
  );
}