// src/components/jobs/PromoteJobModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface PromoteJobModalProps {
  job: { id: number; title: string };
  onClose: () => void;
}

export const PromoteJobModal = ({ job, onClose }: PromoteJobModalProps) => {
  const [promotionType, setPromotionType] = useState('featured');
  const [isPromoting, setIsPromoting] = useState(false);

  const handlePromote = async () => {
    setIsPromoting(true);
    console.log(`Promoting job "${job.title}" (ID: ${job.id}) as: ${promotionType}`);
    
    // TODO: Add your backend API call here
    // await axios.post('/recruiter/jobs/promote', { jobId: job.id, type: promotionType });

    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`Job successfully promoted as ${promotionType}!`);
    setIsPromoting(false);
    onClose();
  };

  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-3xl p-0">
        <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-10">
          <X />
        </button>
        
        <div className="p-6 sm:p-8">
          <div>
            <h3 className="text-2xl font-bold">Promote Job: {job.title}</h3>
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
            <button onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button onClick={handlePromote} className="btn btn-primary" disabled={isPromoting}>
              {isPromoting ? <span className="loading loading-spinner"></span> : 'Promote Job →'}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};