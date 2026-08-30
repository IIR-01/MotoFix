import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useCart } from '../context/CartContext';

const PURPOSE_LABELS = {
  order: 'MotoFix order payment',
  vendor_listing_fee: 'MotoFix vendor listing fee',
};

// Stands in for SSLCommerz's hosted checkout page — the project has no real
// store_id/store_passwd yet (see server/services/sslcommerzService.js). It
// looks up the session by tranId the same way the real gateway would, and
// "Simulate Successful/Failed Payment" call back into the same completion
// endpoint a real IPN/redirect would hit. Deliberately a public route (no
// login required): a vendor paying their listing fee at registration
// doesn't have an account — let alone a token — yet.
export default function PaymentGateway() {
  const { tranId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    apiFetch(`/payments/${tranId}`)
      .then(setPayment)
      .catch((err) => setError(err.message));
  }, [tranId]);

  const handleResult = async (result) => {
    setProcessing(true);
    setError('');
    try {
      const res = await apiFetch(`/payments/${tranId}/complete`, {
        method: 'POST',
        body: JSON.stringify({ result }),
      });

      if (res.status === 'failed') {
        if (payment.purpose === 'order') {
          navigate('/cart', {
            state: { paymentError: 'Payment failed. Your cart has been kept so you can try again.' },
          });
        } else {
          navigate('/register', {
            state: { paymentError: 'Listing fee payment failed. Please try registering again.' },
          });
        }
        return;
      }

      if (payment.purpose === 'order') {
        clearCart();
        navigate(`/orders/${res.order._id}`, { state: { justPaid: true } });
      } else {
        sessionStorage.removeItem('motofix_pending_vendor_form');
        navigate('/login', { state: { message: res.message } });
      }
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  if (error && !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
        <p className="text-primary-red text-sm">{error}</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-400 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        <div className="bg-dark-red px-6 py-5 text-white">
          <p className="text-xs uppercase tracking-wide opacity-80">Simulated payment gateway</p>
          <p className="font-display font-semibold text-xl">SSLCOMMERZ</p>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-500">
            This project doesn't have a live SSLCommerz store yet, so this page stands in for it — pick an
            outcome below and MotoFix reacts exactly as it would to the real gateway's callback.
          </p>

          <div className="bg-light-red-bg border border-primary-red/20 rounded-md p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{PURPOSE_LABELS[payment.purpose]}</p>
            <p className="font-display font-semibold text-2xl text-dark-red mt-1">{`৳${payment.amount}`}</p>
            <p className="text-xs text-gray-400 mt-1">Transaction ID: {payment.tranId}</p>
          </div>

          {error && <p className="text-sm text-primary-red">{error}</p>}

          <button
            onClick={() => handleResult('success')}
            disabled={processing}
            className="bg-primary-red hover:bg-dark-red transition-colors text-white py-3 rounded-md text-base font-medium disabled:opacity-50"
          >
            {processing ? 'Processing…' : 'Simulate Successful Payment'}
          </button>
          <button
            onClick={() => handleResult('fail')}
            disabled={processing}
            className="border border-primary-red/50 text-dark-red py-3 rounded-md text-base font-medium disabled:opacity-50"
          >
            Simulate Failed Payment
          </button>
        </div>
      </div>
    </div>
  );
}
