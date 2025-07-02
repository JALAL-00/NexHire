'use client';

import { useRef, useState } from 'react';
import axios from 'axios';
import { Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { getInitials } from '@/lib/utils'; // Import our new helper

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ImageUploadProps {
  imageType: 'profilePicture' | 'coverPhoto';
  currentImageUrl: string | null | undefined;
  onUploadSuccess: (imageType: 'profilePicture' | 'coverPhoto', newPath: string) => void;
  className?: string;
  isProfilePic?: boolean;
  disabled?: boolean;
  userName?: string; // <-- ADD THIS PROP
}

export default function ImageUpload({ 
  imageType, 
  currentImageUrl, 
  onUploadSuccess, 
  className = '', 
  isProfilePic = false, 
  disabled = false,
  userName, // <-- Destructure the new prop
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // ... your handleFileChange logic remains exactly the same
    if (disabled) return;

    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    const endpointUrl = imageType === 'profilePicture' 
      ? `${API_URL}/auth/upload-profile-picture` 
      : `${API_URL}/auth/upload-cover-photo`;

    try {
      const token = (await import('js-cookie')).default.get('auth_token');
      const response = await axios.post(endpointUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.filePath) {
        onUploadSuccess(imageType, response.data.filePath);
      } else {
        throw new Error("Server response did not include a file path.");
      }

    } catch (error) {
      console.error('Image upload failed:', error);
      const errorMessage = (error as any).response?.data?.message || 'Image upload failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  // No longer need fullImageUrl logic here, we'll decide what to render below.

  const containerClasses = `relative group overflow-hidden bg-gray-300 ${isProfilePic ? 'rounded-full' : ''} ${className}`;
  const disabledClasses = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <div className={`${containerClasses} ${disabledClasses}`} onClick={handleClick}>
      {currentImageUrl ? (
        // --- RENDER THE IMAGE IF IT EXISTS ---
        <img
          src={`${API_URL}/uploads/${currentImageUrl}`}
          alt={imageType}
          className="w-full h-full object-cover"
        />
      ) : (
        // --- RENDER THE PLACEHOLDER IF NO IMAGE ---
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
          {isProfilePic ? (
            <span className="font-bold text-5xl">{getInitials(userName)}</span>
          ) : (
            // For cover photos, an icon is better than initials
            <ImageIcon size={48} className="opacity-50" />
          )}
        </div>
      )}

      {/* The upload overlay logic remains the same */}
      {!disabled && (
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        disabled={disabled}
      />
    </div>
  );
}