import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { apiFetch } from '../api/client';

// Mirrors DELIVERY_CHARGE in server/controllers/paymentController.js —
// shown here just as a preview; the server recomputes the real total from
// the DB at checkout, so this can never be relied on for the actual charge.
const DELIVERY_CHARGE_PREVIEW = 60;

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(location.state?.paymentError || '');
  const [placing, setPlacing] = useState(false);

  const deliveryCharge = items.length ? DELIVERY_CHARGE_PREVIEW : 0;
  const total = subtotal + deliveryCharge;

  const handleCheckout = async () => {
    setError('');
    setPlacing(true);
    try {
      const res = await apiFetch('/payments/order/init', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map((i) => ({ partId: i.partId, quantity: i.quantity })),
        }),
      });
      navigate(`/payment/gateway/${res.tranId}`);
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  };

  return (
    <div>
      <Navbar active="Cart" />
      <div className="max-w-3xl mx-auto px-6 py-6">
        <h1 className="font-display font-semibold text-3xl text-dark-red">Your cart</h1>

        {error && (
          <p className="text-sm text-dark-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3 mt-4">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <div className="mt-10 text-center">
            <p className="text-gray-400">Your cart is empty.</p>
            <Link to="/parts" className="text-primary-red text-sm font-medium mt-2 inline-block">
              Browse parts &rarr;
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 mt-6">
              {items.map((item) => (
                <div
                  key={item.partId}
                  className="bg-white border border-primary-red/20 rounded-lg px-5 py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-red truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.vendorName}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.partId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 border border-primary-red/50 rounded text-dark-red disabled:opacity-40"
                    >
                      &minus;
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.partId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 border border-primary-red/50 rounded text-dark-red disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-display font-semibold text-primary-red w-20 text-right shrink-0">
                    {`৳${item.price * item.quantity}`}
                  </p>
                  <button
                    onClick={() => removeItem(item.partId)}
                    className="text-xs text-gray-400 hover:text-primary-red shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-5 flex flex-col gap-2 max-w-sm ml-auto">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{`৳${subtotal}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery charge</span>
                <span>{`৳${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between font-display font-semibold text-dark-red text-lg pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{`৳${total}`}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={placing}
                className="bg-primary-red hover:bg-dark-red transition-colors text-white py-3.5 rounded-md text-base font-medium mt-3 disabled:opacity-50"
              >
                {placing ? 'Preparing checkout…' : 'Checkout with SSLCommerz'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
