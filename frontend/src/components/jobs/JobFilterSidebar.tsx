// src/components/jobs/JobFilterSidebar.tsx
'use client';

// Define the shape of the filters state from the parent page
interface FiltersState {
  jobType: string[]; // jobType is an array of strings
  salary: string;
}

interface JobFilterSidebarProps {
  filters: FiltersState;
  onFilterChange: (filterName: keyof FiltersState, value: string | string[]) => void;
}

const jobTypeOptions = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

export default function JobFilterSidebar({ filters, onFilterChange }: JobFilterSidebarProps) {

  // Handler for checkbox changes for Job Type
  const handleJobTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const currentJobTypes = filters.jobType || [];

    const newJobTypes = checked
      ? [...currentJobTypes, value]
      : currentJobTypes.filter(type => type !== value);
    
    onFilterChange('jobType', newJobTypes);
  };

  return (
    <aside className="col-span-12 lg:col-span-3">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <h3 className="font-bold text-xl">Filter Options</h3>
        
        <div className="divider my-0"></div>

        {/* --- Job Type Filter (using checkboxes for multi-select) --- */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Job Type</h4>
          <div className="space-y-2">
            {jobTypeOptions.map(type => (
              <div key={type} className="form-control">
                <label className="label cursor-pointer justify-start gap-3 p-0">
                  <input 
                    type="checkbox"
                    value={type}
                    checked={(filters.jobType || []).includes(type)}
                    onChange={handleJobTypeChange}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="label-text">{type}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="divider my-0"></div>

        {/* --- Salary Filter --- */}
        <div>
          <label className="label"><span className="label-text font-semibold">Salary Range</span></label>
          <input 
            type="text" 
            placeholder="e.g., >50000 or 80k-100k" 
            className="input input-bordered w-full" 
            value={filters.salary} 
            onChange={(e) => onFilterChange('salary', e.target.value)} 
          />
        </div>
      </div>
    </aside>
  );
}