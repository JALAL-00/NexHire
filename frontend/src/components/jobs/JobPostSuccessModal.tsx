// src/components/jobs/JobPostSuccessModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface JobPostSuccessModalProps {
  jobTitle: string;
  onClose: () => void;
}

export const JobPostSuccessModal = ({ jobTitle, onClose }: JobPostSuccessModalProps) => {
  const router = useRouter();
  const [promotionType, setPromotionType] = useState('featured');
  const [isPromoting, setIsPromoting] = useState(false);

  const handleViewJobs = () => {
    // This should navigate to the page where recruiters see all their jobs
    router.push('/manage-jobs'); 
  };

  const handlePromote = async () => {
    setIsPromoting(true);
    console.log(`Promoting job "${jobTitle}" as: ${promotionType}`);
    
    // Simulate an API call for the promotion feature
    await new Promise(resolve => setTimeout(resolve, 1500));

    alert(`Job successfully promoted as ${promotionType}!`);
    setIsPromoting(false);
    onClose(); // Close the modal and trigger navigation
  };

  return (
    <dialog id="success_modal" className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-3xl p-0">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10">
          <X />
        </button>
        
        <div className="p-6 sm:p-8">
          <div className="text-center">
            <span className="text-5xl">🎉</span>
            <h3 className="font-bold text-2xl mt-4">Congratulation, Your Job is successfully posted!</h3>
            <p className="text-gray-500 mt-2">You can manage your job from the 'my-jobs' section in your dashboard.</p>
            <button onClick={handleViewJobs} className="btn btn-outline btn-primary mt-4">
              View Jobs →
            </button>
          </div>

          <div className="divider my-8"></div>

          <div>
            <h4 className="text-xl font-bold">Promote Job: {jobTitle}</h4>
            <p className="text-gray-500 mt-1">Fusce commodo, sem non tempor convallis, sapien turpis bibendum turpis, non pharetra nisl velit pulvinar lectus.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Featured Job Option */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${promotionType === 'featured' ? 'border-primary bg-primary/5' : 'border-base-200'}`}
                onClick={() => setPromotionType('featured')}
              >
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4 p-0">
                    <input type="radio" name="promotion" className="radio radio-primary" value="featured" checked={promotionType === 'featured'} readOnly />
                    <span className="label-text font-semibold">Featured Your Job</span>
                  </label>
                </div>
                <div className="bg-gray-200/50 p-2 rounded-md mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-1">ALWAYS ON THE TOP</p>
                  <div className="w-full h-16 bg-white border rounded flex items-center justify-center text-gray-300">Visual Preview</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Sed neque diam, lacinia nec dolor et, euismod bibendum turpis.</p>
              </div>

              {/* Highlight Job Option */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${promotionType === 'highlight' ? 'border-primary bg-primary/5' : 'border-base-200'}`}
                onClick={() => setPromotionType('highlight')}
              >
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4 p-0">
                    <input type="radio" name="promotion" className="radio radio-primary" value="highlight" checked={promotionType === 'highlight'} readOnly />
                    <span className="label-text font-semibold">Highlight Your Job</span>
                  </label>
                </div>
                <div className="bg-gray-200/50 p-2 rounded-md mt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-1">HIGHLIGHT JOB WITH COLOR</p>
                  <div className="w-full h-16 bg-orange-100 border border-orange-300 rounded flex items-center justify-center text-orange-500">Visual Preview</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Sed neque diam, lacinia nec dolor et, euismod bibendum turpis.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <button onClick={onClose} className="btn btn-ghost">Skip Now</button>
            <button onClick={handlePromote} className="btn btn-primary" disabled={isPromoting}>
              {isPromoting ? <span className="loading loading-spinner"></span> : 'Promote Job →'}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};