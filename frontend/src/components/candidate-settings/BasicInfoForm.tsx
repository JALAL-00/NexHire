'use client';

import ImageUpload from '@/components/profile/ImageUpload';

// Define the shape of the props this component expects
interface BasicInfoFormProps {
    formData: {
        firstName: string;
        lastName: string;
        title: string;
        location: string;
        profilePicture: string | null;
    };
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProfilePicUpload: (newPath: string) => void;
}

export default function BasicInfoForm({ formData, onInputChange, onProfilePicUpload }: BasicInfoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 flex flex-col items-center">
        <h3 className="font-bold text-lg mb-4 self-start">BASIC INFORMATION</h3>
        <ImageUpload
          imageType="profilePicture"
          currentImageUrl={formData.profilePicture}
          onUploadSuccess={onProfilePicUpload}
          isProfilePic={true}
          className="w-40 h-40"
        />
        <p className="text-sm text-gray-500 mt-2">Update your photo</p>
      </div>
      <div className="md:col-span-2 space-y-4 pt-12">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label"><span className="label-text">First Name</span></label>
            <input type="text" name="firstName" value={formData.firstName} onChange={onInputChange} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text">Last Name</span></label>
            <input type="text" name="lastName" value={formData.lastName} onChange={onInputChange} className="input input-bordered w-full" />
          </div>
        </div>
        <div>
          <label className="label"><span className="label-text">Occupation / Title</span></label>
          <input type="text" name="title" value={formData.title} onChange={onInputChange} className="input input-bordered w-full" placeholder="e.g., Graphic Designer" />
        </div>
        <div>
          <label className="label"><span className="label-text">Location</span></label>
          <input type="text" name="location" value={formData.location} onChange={onInputChange} className="input input-bordered w-full" placeholder="e.g., Dhaka, Bangladesh" />
        </div>
      </div>
    </div>
  );
}