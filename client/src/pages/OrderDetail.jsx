import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';
import { ORDER_STATUS_STYLES } from '../constants/orderStatus';

export default function OrderDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch(`/orders/${id}`).then(setOrder).catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <Navbar active="My Orders" />
      <div className="max-w-2xl mx-auto px-6 py-6">
        <Link to="/orders" className="text-sm text-primary-red">
          &larr; Back to orders
        </Link>

        {location.state?.justPaid && (
          <p className="mt-4 text-sm text-dark-red bg-light-red-bg border border-primary-red/30 rounded-md px-4 py-3">
            Payment successful — your order has been placed.
          </p>
        )}
        {error && <p className="text-sm text-primary-red mt-4">{error}</p>}

        {!order ? (
          <p className="text-sm text-gray-400 mt-6">Loading…</p>
        ) : (
          <div className="mt-6 bg-white border border-primary-red/20 rounded-xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display font-semibold text-xl text-dark-red truncate">{order.orderNumber}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs font-medium border rounded-full px-3 py-1 shrink-0 ${ORDER_STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="text-dark-red font-medium truncate">{item.name}</p>
                    <p className="text-gray-500 text-xs">
                      {item.vendorName} &middot; Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-gray-600 shrink-0">{`৳${item.price * item.quantity}`}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col gap-1.5 max-w-xs ml-auto text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{`৳${order.subtotal}`}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery charge</span>
                <span>{`৳${order.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between font-display font-semibold text-dark-red text-base pt-2 border-t border-gray-200">
                <span>Total paid</span>
                <span>{`৳${order.totalAmount}`}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
