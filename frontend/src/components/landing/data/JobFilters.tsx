// src/components/landing/JobFilters.tsx
import Image from 'next/image';

const JobFilters = () => {
  return (
    <aside className="col-span-12 lg:col-span-3">
      <div className="card bg-base-100 shadow-md border p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Job Type</h3>
          <button className="text-sm text-gray-500 hover:text-blue-600">Clear</button>
        </div>
        <div className="space-y-2">
          <div className="form-control"><label className="label cursor-pointer justify-start gap-3"><input type="checkbox" defaultChecked className="checkbox checkbox-primary" /><span className="label-text">Full Time</span></label></div>
          <div className="form-control"><label className="label cursor-pointer justify-start gap-3"><input type="checkbox" className="checkbox checkbox-primary" /><span className="label-text">Part Time</span></label></div>
          <div className="form-control"><label className="label cursor-pointer justify-start gap-3"><input type="checkbox" className="checkbox checkbox-primary" /><span className="label-text">Remote</span></label></div>
          <div className="form-control"><label className="label cursor-pointer justify-start gap-3"><input type="checkbox" className="checkbox checkbox-primary" /><span className="label-text">Internship</span></label></div>
        </div>
      </div>

      <div className="card bg-gray-100 h-80 mt-6 flex items-center justify-center rounded-lg overflow-hidden relative">
        <Image
        src="/Images/Job-Search.jpg"
        alt="Advertisement"
        fill
        style={{ objectFit: 'cover' }}
        />
      </div>
    </aside>
  );
};
export default JobFilters;