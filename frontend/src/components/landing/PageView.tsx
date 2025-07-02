// frontend/src/components/landing/PageView.tsx
'use client';

import JobFilters from '@/components/landing/data/JobFilters';
import JobCard from '@/components/landing/data/JobCard';
import { mockJobs } from '@/lib/mock-jobs';
import { statsData, popularVacanciesData, howItWorksData, featuredJobsData, topCompaniesData, testimonialsData, callToActionData } from '@/components/landing/data/land-data';
import { Search, MapPin, DollarSign, Calendar, Bookmark, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main>
        {/* HERO SECTION */}
        <section className="container mx-auto px-4 mt-24 pt-10">
          <div className="bg-primary rounded-2xl shadow-lg text-white p-10 max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold">OVER 10,000+ JOBS TO APPLY</h1>
            <p className="mt-4 text-lg text-blue-100">
              Your Next Big Career Move Starts Right Here - Explore the Best Job Opportunities and Take the First Step Toward Your Future!
            </p>
            <div className="mt-8 bg-white rounded-full flex flex-col md:flex-row items-stretch shadow-md overflow-hidden max-w-3xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
                <Search className="text-gray-400" />
                <input type="text" placeholder="Search for jobs" className="w-full outline-none text-gray-800" />
              </div>
              <div className="flex items-center gap-2 px-4 py-3 flex-1 border-b md:border-b-0 md:border-r">
                <MapPin className="text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Location" className="w-full outline-none text-gray-800" />
              </div>
              <button className="bg-primary hover:bg-primary-focus text-white px-6 py-3 md:rounded-r-full w-full md:w-auto">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* TRUSTED LOGOS */}
        <section className="py-16 container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm py-4 px-6 text-center text-gray-500 text-sm">
            Trusted by
            <div className="mt-4 flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
              <Image src="/logos/microsoft.png" width={120} height={30} className="h-6 w-auto object-contain" alt="Microsoft" unoptimized />
              <Image src="/logos/walmart.png" width={120} height={30} className="h-6 w-auto object-contain" alt="Walmart" unoptimized />
              <Image src="/logos/accenture.png" width={120} height={30} className="h-6 w-auto object-contain" alt="Accenture" unoptimized />
              <Image src="/logos/samsung.png" width={120} height={30} className="h-6 w-auto object-contain" alt="Samsung" unoptimized />
              <Image src="/logos/amazon.png" width={120} height={30} className="h-6 w-auto object-contain" alt="Amazon" unoptimized />
              <Image src="/logos/adobe.png" width={120} height={30} className="h-6 w-auto object-contain" alt="Adobe" unoptimized />
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="container mx-auto px-4 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div key={index} className="card bg-base-100 shadow-lg border p-6 flex-row items-center gap-4 rounded-lg">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${stat.featured ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}></div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POPULAR VACANCIES */}
        <section className="container mx-auto px-4 pb-24">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Most Popular Vacancies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
            {popularVacanciesData.map((job, i) => (
              <Link href="#" key={i} className="text-gray-600 hover:text-blue-600 transition-colors">{job}</Link>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gray-100 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">How NexHire Works</h2>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksData.map((step, index) => (
                <div key={index} className={`card bg-base-100 p-8 text-center items-center rounded-lg ${index === 1 ? 'shadow-2xl border-t-4 border-blue-600' : 'shadow-lg'}`}>
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                      <step.icon className="text-blue-600" size={32} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                  <p className="text-gray-500 mt-2 text-sm">Aliquam facilisis egestas sapien, nec tempor leo tristique at.</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED JOBS */}
        <section className="container mx-auto px-4 py-24">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Featured Jobs</h2>
          <div className="space-y-4">
            {featuredJobsData.map((job, index) => (
              <div key={index} className={`card card-side bg-base-100 p-4 items-center border rounded-lg transition-all hover:shadow-lg ${job.featured ? 'border-blue-600' : ''}`}>
                <figure className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center ml-4">
                  <Image src={job.logo} alt={`${job.title} logo`} width={40} height={40} unoptimized />
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-lg">{job.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={16} /> {job.salary}</span>
                    <span className="flex items-center gap-1"><Calendar size={16} /> 4 Days Remaining</span>
                  </div>
                </div>
                <div className="card-actions justify-end items-center gap-4 pr-4">
                  <button className="btn btn-ghost btn-square text-gray-400 hover:text-blue-600"><Bookmark/></button>
                  <button className={`btn ${job.featured ? 'btn-primary' : 'btn-outline btn-primary'}`}>Apply Now →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JOB FEED */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-12 gap-8">
            <JobFilters />
            <div className="col-span-12 md:col-span-9 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Latest Jobs</h2>
                <p className="text-gray-500">2,640 Result Found</p>
              </div>
              {mockJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
              <div className="text-center pt-6">
                <button className="btn btn-primary btn-wide">See All Jobs</button>
              </div>
            </div>
          </div>
        </section>

        {/* TOP COMPANIES */}
        <section className="bg-gray-100 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">Top Companies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCompaniesData.map((company, index) => (
                <div key={index} className={`card bg-base-100 p-6 text-center items-center border rounded-lg transition-all hover:shadow-lg ${company.featured ? 'border-blue-600' : ''}`}>
                  <figure className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Image src={company.logo} alt={`${company.name} logo`} width={40} height={40} unoptimized />
                  </figure>
                  <h3 className="font-bold text-lg">{company.name}</h3>
                  <button className={`btn w-full mt-4 ${company.featured ? 'btn-primary' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>Open Position</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENT TESTIMONIALS */}
        <section className="container mx-auto px-4 py-24">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Client Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((client, i) => (
              <div key={i} className="bg-white shadow-lg p-8 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" fill="currentColor" size={20} />
                  ))}
                </div>
                <p className="mb-6 text-gray-700 italic">“{client.message}”</p>
                <div className="flex items-center gap-4 border-t pt-6">
                  <div className="w-12 h-12 rounded-full text-white flex items-center justify-center" style={{ backgroundColor: '#4633FF' }}>
                    <span className="text-lg font-semibold leading-none">{client.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{client.name}</h4>
                    <p className="text-sm text-gray-500">{client.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {callToActionData.map((item, i) => (
                <div
                  key={i}
                  className={item.cardStyle}
                  style={item.backgroundColor ? { backgroundColor: item.backgroundColor } : {}}
                >
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="mt-2 max-w-sm" style={item.descriptionColor ? { color: item.descriptionColor } : {}}>{item.description}</p>
                  <Link href={item.link} className={item.buttonStyle}>{item.buttonText}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
