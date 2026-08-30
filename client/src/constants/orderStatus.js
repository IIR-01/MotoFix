// Keep in sync with the `status` enum on server/models/Order.js.
export const ORDER_STATUS_STYLES = {
  Processing: 'bg-light-red-bg text-primary-red border-primary-red/30',
  Shipped: 'bg-gray-100 text-gray-600 border-gray-200',
  Delivered: 'bg-dark-red text-white border-dark-red',
  Cancelled: 'bg-gray-100 text-gray-400 border-gray-200',
};
