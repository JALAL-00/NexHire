'use client';

// No longer need useState
import { careerGuidesData } from '@/lib/dummy-data';
import { GuideCard } from '@/components/career-guides/GuideCard';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function CareerGuidesPage() {
  // --- UPDATE: All state and handlers are removed, simplifying the component ---

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-primary-content text-center py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold mb-4">Career Growth Hub</h1>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Explore expert articles and vlogs to supercharge your job search, interviews, and professional development.
          </p>
          <div className="mt-8 max-w-lg mx-auto">
            <div className="form-control">
              <div className="input-group">
                <input type="text" placeholder="Search guides…" className="input input-bordered w-full text-black" />
                <button className="btn btn-square btn-secondary">
                  <Search />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Latest Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {careerGuidesData.map((guide) => (
            // The card is now self-contained, no extra props needed
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-base-200">
          <div className="container mx-auto py-20 px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Make Your Move?</h2>
              <p className="max-w-xl mx-auto text-gray-600 mb-8">
                  You've got the knowledge, now it's time to apply it. Browse thousands of open positions from top companies on NexHire.
              </p>
              <Link href="/jobs" className="btn btn-primary btn-lg">
                  Find Your Next Job
              </Link>
          </div>
      </section>
      
      {/* The modal is no longer needed here */}
    </div>
  );
}