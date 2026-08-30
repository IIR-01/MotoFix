import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { apiFetch } from '../api/client';
import { ORDER_STATUS_STYLES } from '../constants/orderStatus';

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/orders').then(setOrders).catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <Navbar active="My Orders" />
      <div className="max-w-3xl mx-auto px-6 py-6">
        <h1 className="font-display font-semibold text-3xl text-dark-red">Order history</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">Track your past and current orders.</p>

        {error && <p className="text-sm text-primary-red">{error}</p>}

        {orders === null ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : orders.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-sm text-gray-400">You haven't placed any orders yet.</p>
            <Link to="/parts" className="text-primary-red text-sm font-medium mt-2 inline-block">
              Browse parts &rarr;
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="bg-white border border-primary-red/20 hover:border-primary-red rounded-lg px-5 py-4 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-dark-red text-sm truncate">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} &middot; {order.items.length} item
                    {order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-medium border rounded-full px-3 py-1 ${ORDER_STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <p className="font-display font-semibold text-primary-red">{`৳${order.totalAmount}`}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
