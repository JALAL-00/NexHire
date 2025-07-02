'use client';

interface FiltersState {
  location: string;
  skills: string;
  salary: string;
  jobType: string[];  // jobType is an array of strings
  jobTitle: string;  // Added jobTitle filter
}

interface JobFiltersProps {
  filters: FiltersState;  // Required filters prop
  onFilterChange: (filterName: keyof FiltersState, value: string | string[]) => void;
}

const jobTypeOptions = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

// Sample Data for Featured Jobs (replace with actual data if needed)
const featuredJobsData = [
  { id: 1, title: 'Software Engineer', location: 'San Francisco', salary: '$120k - $150k', featured: true },
  { id: 2, title: 'UI/UX Designer', location: 'New York', salary: '$80k - $100k', featured: false },
  { id: 3, title: 'Data Scientist', location: 'Seattle', salary: '$110k - $140k', featured: true }
];

export default function JobFilters({ filters, onFilterChange }: JobFiltersProps) {
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
      <div className="card bg-base-100 shadow-md border p-6 rounded-lg space-y-6">
        <h3 className="font-bold text-xl">Filter Jobs</h3>

        {/* Job Title Filter */}
        <div>
          <label className="label"><span className="label-text font-semibold">Job Title</span></label>
          <input
            type="text"
            placeholder="Job title"
            className="input input-bordered w-full"
            value={filters.jobTitle}
            onChange={(e) => onFilterChange('jobTitle', e.target.value)}  // Updated to handle jobTitle
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="label"><span className="label-text font-semibold">Location</span></label>
          <input
            type="text"
            placeholder="City, state, or country"
            className="input input-bordered w-full"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          />
        </div>

        {/* Skills Filter */}
        <div>
          <label className="label"><span className="label-text font-semibold">Skills (comma-separated)</span></label>
          <input
            type="text"
            placeholder="e.g., React, Node.js"
            className="input input-bordered w-full"
            value={filters.skills}
            onChange={(e) => onFilterChange('skills', e.target.value)}
          />
        </div>

        {/* Salary Filter */}
        <div>
          <label className="label"><span className="label-text font-semibold">Salary Range</span></label>
          <input
            type="text"
            placeholder="e.g., >50000"
            className="input input-bordered w-full"
            value={filters.salary}
            onChange={(e) => onFilterChange('salary', e.target.value)}
          />
        </div>

        {/* Job Type Filter */}
        <div>
          <h3 className="font-semibold text-lg mb-2">Job Type</h3>
          <div className="space-y-2">
            {jobTypeOptions.map((type) => (
              <div key={type} className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    value={type}
                    checked={(filters.jobType || []).includes(type)}
                    onChange={handleJobTypeChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">{type}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
