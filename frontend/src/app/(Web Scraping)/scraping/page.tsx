// src/app/(Web Scraping)/scraping/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Globe, Search, MapPin, ListFilter, Zap, Info, Bot, Target, AlertTriangle, ExternalLink } from 'lucide-react';

// Define an interface for the job data we expect from the backend
interface ScrapedJob {
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  source: string;
}

export default function ScrapingPage() {
  const [source, setSource] = useState('linkedin');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ScrapedJob[]>([]);
  const [error, setError] = useState<string>('');

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults([]); // Clear previous results

    const token = Cookies.get('auth_token');
    if (!token) {
      setError("Authentication error. Please log in again.");
      setIsLoading(false);
      return;
    }

    const payload = { source, searchTerm, location, limit };
    console.log("Starting scrape with payload:", payload);

    try {
      const response = await axios.post('http://localhost:3000/scraper/jobs', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "An unexpected error occurred during scraping.";
      console.error("Scraping failed:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-200 p-4 sm:p-6 lg:p-8">
      <main className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Automated Job Discovery</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Use our powerful scraping tool to find targeted job opportunities from across the web.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: The Form */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100/90 backdrop-blur-lg shadow-xl border border-gray-200/50">
              <form onSubmit={handleScrape} className="card-body space-y-6">
                <h2 className="card-title text-2xl">Scraping Parameters</h2>
                
                {/* Source Selection */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Source</span></label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select 
                      className="select select-bordered w-full pl-10"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="indeed">Indeed</option>
                      <option value="glassdoor">Glassdoor</option>
                    </select>
                  </div>
                </div>

                {/* Search Term */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Search Term (e.g., "Data Scientist")</span></label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Job title or keyword" 
                      className="input input-bordered w-full pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label"><span className="label-text">Location</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="City or country" 
                      className="input input-bordered w-full pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Limit Slider */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Job Limit</span>
                    <span className="label-text-alt text-primary font-bold">{limit}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={limit} 
                    className="range range-primary" 
                    onChange={(e) => setLimit(Number(e.target.value))}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-full md:w-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <Zap className="mr-2" size={20} />
                        Start Scraping
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">How It Works</h2>
                <ul className="space-y-4 text-sm text-gray-600 mt-2">
                  <li className="flex gap-3"><Info size={24} className="text-primary flex-shrink-0" /><span>Enter a job title and location you're interested in.</span></li>
                  <li className="flex gap-3"><Bot size={24} className="text-primary flex-shrink-0" /><span>Our smart scraper will search the selected source for matching roles.</span></li>
                  <li className="flex gap-3"><Target size={24} className="text-primary flex-shrink-0" /><span>Results will appear below, giving you a targeted list of opportunities.</span></li>
                </ul>
              </div>
            </div>
          <div className="card bg-gray-200 h-60 flex items-center justify-center">
            <img
              src="/images/Job-Search.jpg" // Replace with your image path or URL
              alt="Advertisement"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-12">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Scraping Results</h2>
              <div className="mt-4">
                {isLoading && (
                  <div className="text-center py-16">
                    <span className="loading loading-dots loading-lg"></span>
                    <p>Scraping in progress...</p>
                  </div>
                )}
                {error && (
                   <div role="alert" className="alert alert-error">
                     <AlertTriangle />
                     <span><strong>Error:</strong> {error}</span>
                   </div>
                )}
                {!isLoading && !error && results.length === 0 && (
                  <div className="text-center text-gray-400 py-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <ListFilter size={48} className="mx-auto" />
                    <p className="mt-4">Your scraped job listings will appear here.</p>
                  </div>
                )}
                {!isLoading && results.length > 0 && (
                  <div className="space-y-4">
                    {results.map((job, index) => (
                      <div key={index} className="card card-compact bg-base-200 shadow">
                        <div className="card-body">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="card-title text-lg">{job.title}</h3>
                              <p className="text-md font-semibold text-gray-700">{job.company}</p>
                              <p className="text-sm text-gray-500">{job.location}</p>
                            </div>
                            <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                              Apply <ExternalLink size={14} />
                            </a>
                          </div>
                          <p className="text-sm mt-2">{job.description}</p>
                          <div className="card-actions justify-end">
                            <div className="badge badge-outline capitalize">{job.source}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}