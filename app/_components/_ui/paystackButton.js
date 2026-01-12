// components/PaystackButton.js
'use client';

import { useState } from 'react';

export default function PaystackButton({ email, amount, reference }) {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // add this in .env
      email,
      amount: amount * 100, // convert to kobo
      currency: 'NGN',
      ref: reference,
      callback: function (response) {
        // Payment successful, you can redirect or notify user
        alert(`Payment successful. Reference: ${response.reference}`);
      },
      onClose: function () {
        alert('Payment was not completed');
        setLoading(false);
      },
    });

    handler.openIframe();
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
}
