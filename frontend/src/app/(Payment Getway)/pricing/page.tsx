'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react'; // Use a better check icon
import CheckoutModal from '@/components/payments/CheckoutModal';

const plans = [
  { name: 'BASIC', price: 10, features: ['Post 1 Job', 'Urgent & Featured Jobs', 'Highlights Job with Colors', 'Access & Saved 5 Candidates', '10 Days Resume Visibility', '24/7 Critical Support'] },
  { name: 'STANDARD', price: 29, features: ['3 Active Jobs', 'Urgent & Featured Jobs', 'Highlights Job with Colors', 'Access & Saved 10 Candidates', '20 Days Resume Visibility', '24/7 Critical Support'], recommended: true },
  { name: 'PREMIUM', price: 49, features: ['6 Active Jobs', 'Urgent & Featured Jobs', 'Highlights Job with Colors', 'Access & Saved 20 Candidates', '30 Days Resume Visibility', '24/7 Critical Support'] },
];

export default function PricingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Default to the recommended plan
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); 

  const handleChoosePlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-gray-50 p-4 sm:p-8">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          {/* --- FIX: Use primary theme color --- */}
          <div className="bg-primary p-8 rounded-lg text-primary-content mb-12">
            <h1 className="text-3xl font-bold">Buy Premium Subscription to Post a Job</h1>
            <p className="mt-2 opacity-90">Unlock powerful features to find the best talent faster. Choose a plan that fits your hiring needs.</p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div 
                key={plan.name} 
                // --- FIX: Use primary theme color for the border ---
                className={`card bg-base-100 shadow-xl border-2 transition-all duration-300 ${plan.recommended ? 'border-primary' : 'border-base-200'}`}
              >
                <div className="card-body">
                  {plan.recommended && <div className="badge badge-primary self-start">Recommendation</div>}
                  <h2 className="card-title text-xl font-semibold">{plan.name}</h2>
                  <p className="text-gray-500 text-sm">Praesent eget pulvinar orci. Duis ut pellentesque.</p>
                  <p className="text-4xl font-bold my-4">${plan.price}<span className="text-lg font-normal text-gray-500">/Monthly</span></p>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center gap-3">
                        {/* --- FIX: Use primary theme color for checkmarks --- */}
                        <CheckCircle className="text-primary" size={20}/> 
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="card-actions mt-auto">
                    {/* --- FIX: Use primary button style --- */}
                    <button onClick={() => handleChoosePlan(plan)} className="btn btn-primary btn-block">
                      Choose Plan →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <CheckoutModal plan={selectedPlan} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}