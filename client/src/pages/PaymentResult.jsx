import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useCart } from '../context/CartContext';

// Must match Register.jsx's PENDING_FORM_KEY — a vendor's form is stashed
// there before leaving for the real SSLCommerz page, and needs clearing here
// once their listing fee has actually cleared.
const PENDING_VENDOR_FORM_KEY = 'motofix_pending_vendor_form';

// Landing page the customer's browser comes back to after SSLCommerz's
// hosted checkout — the backend has already validated and finalized the
// payment server-side (see paymentController's ssl/success handler) by the
// time this loads, so this just reads the outcome and routes on from there.
export default function PaymentResult() {
  const { tranId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    apiFetch(`/payments/${tranId}`)
      .then((payment) => {
        if (cancelled) return;

        if (payment.status === 'success') {
          if (payment.purpose === 'order') {
            clearCart();
            navigate(`/orders/${payment.orderId}`, { state: { justPaid: true }, replace: true });
          } else {
            sessionStorage.removeItem(PENDING_VENDOR_FORM_KEY);
            navigate('/login', {
              state: { message: 'Listing fee paid. Registered — your application is pending verification.' },
              replace: true,
            });
          }
          return;
        }

        if (payment.status === 'failed') {
          if (payment.purpose === 'order') {
            navigate('/cart', {
              state: { paymentError: 'Payment failed. Your cart has been kept so you can try again.' },
              replace: true,
            });
          } else {
            navigate('/register', {
              state: { paymentError: 'Listing fee payment failed. Please try registering again.' },
              replace: true,
            });
          }
          return;
        }

        // Still 'pending' — SSLCommerz redirected here before our own
        // success handler finished (shouldn't normally happen since that
        // handler redirects only after finalizing). Rare enough to just ask
        // the customer to check back rather than build out polling for it.
        setError('Still confirming your payment — check your order history in a moment.');
      })
      .catch((err) => !cancelled && setError(err.message));

    return () => {
      cancelled = true;
    };
  }, [tranId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <p className={error ? 'text-primary-red text-sm' : 'text-gray-400 text-sm'}>
        {error || 'Confirming your payment…'}
      </p>
    </div>
  );
}
