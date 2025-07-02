'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { X, CreditCard } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface DecodedToken {
  role: 'candidate' | 'recruiter';
}

const CheckoutForm = ({ plan, onClose }: { plan: any, onClose: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsLoading(false);
      return;
    }

    const { error: createPaymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (createPaymentMethodError || !paymentMethod) {
      setError(createPaymentMethodError?.message || 'Failed to process card details.');
      setIsLoading(false);
      return;
    }

    try {
      const token = Cookies.get('auth_token');
      const response = await axios.post('http://localhost:3000/payments/charge', {
        paymentMethodId: paymentMethod.id,
        amount: plan.price,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success && response.data.newAccessToken) {
        setSucceeded(true); 
        
        const newToken = response.data.newAccessToken;
        Cookies.set('auth_token', newToken, { expires: 1 }); 
        
        alert('Payment successful! Your plan has been upgraded.');

        const decodedToken = jwtDecode<DecodedToken>(newToken);
        
        if (decodedToken.role === 'recruiter') {
          window.location.href = '/create-job';
        } else {
          window.location.href = '/jobs';
        }

      } else {
        setError(response.data.message || 'Payment failed. Please try another card.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unexpected error occurred during payment.');
    } finally {
      if (!succeeded) {
        setIsLoading(false);
      }
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'inherit',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Payment Details */}
      <div>
        <h4 className="font-semibold mb-4">Payment System</h4>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-primary/10 border-primary">
            <div className="flex items-center gap-3">
              <CreditCard className="text-primary" />
              <span className="font-medium text-primary">Debit/Credit Card</span>
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {/* Right Column: Summary */}
      <div className="bg-base-200 p-6 rounded-lg flex flex-col justify-between">
        <div>
          <h4 className="font-semibold mb-4">Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Pricing Plan: {plan.name}</span>
              <span className="font-medium">${plan.price.toFixed(2)}</span>
            </div>
            <div className="divider my-1"></div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${plan.price.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button type="submit" className="btn btn-primary btn-block" disabled={!stripe || isLoading || succeeded}>
            {isLoading ? <span className="loading loading-spinner"></span> : succeeded ? 'Payment Successful!' : 'Choose Plan →'}
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">This package will expire after one month.</p>
        </div>
      </div>
    </form>
  );
};

const CheckoutModal = ({ plan, onClose }: { plan: any, onClose: () => void }) => {
  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-sm">
      <div className="modal-box w-11/12 max-w-4xl p-0">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Checkout</h3>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><X /></button>
          </div>
        </div>
        <div className="p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} onClose={onClose} />
          </Elements>
        </div>
      </div>
    </dialog>
  );
};

export default CheckoutModal;