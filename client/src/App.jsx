import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageServices from './pages/ManageServices';
import AdminDashboard from './pages/AdminDashboard';
import PartsSearch from './pages/PartsSearch';
import SelectVehicle from './pages/SelectVehicle';
import RequestRoadsideAssistance from './pages/RequestRoadsideAssistance';
import CustomerHome from './pages/CustomerHome';
import ComingSoon from './components/ComingSoon';
import Customize from './pages/Customize';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import PaymentGateway from './pages/PaymentGateway';
import NearbyMechanics from './pages/NearbyMechanics';
import VendorRequestDashboard from './pages/VendorRequestDashboard';
import Review from './pages/Review';
import MyGarage from './pages/MyGarage';
import SharedBuild from './pages/SharedBuild';

function ProtectedRoute({ children, role }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

// Admins and vendors each have exactly one place to be, so they get sent
// straight there. Customers have three genuinely different things they might
// want, so "/" renders an actual chooser for them instead of picking one.
function HomeRedirect() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'vendor') {
    return <Navigate to={user.serviceCategory === 'mechanic_center' ? '/services' : '/inventory'} replace />;
  }
  if (user?.role === 'customer') return <CustomerHome />;
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Public: stands in for SSLCommerz's own hosted checkout page, which
          obviously wouldn't require a MotoFix login either — a vendor
          paying their listing fee at registration doesn't have an account
          yet at all. */}
      <Route path="/payment/gateway/:tranId" element={<PaymentGateway />} />
      <Route
        path="/services"
        element={
          <ProtectedRoute role="vendor">
            <ManageServices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute role="vendor">
            <ComingSoon
              active="My Inventory"
              title="Parts inventory management is on its way"
              description="Listing and managing your parts catalog is being built as part of Hafizur's features. Check back soon."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute role="vendor">
            <VendorRequestDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadside-request"
        element={
          <ProtectedRoute role="customer">
            <RequestRoadsideAssistance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadside-request/:requestId/mechanics"
        element={
          <ProtectedRoute role="customer">
            <NearbyMechanics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parts"
        element={
          <ProtectedRoute>
            <PartsSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customize"
        element={
          <ProtectedRoute role="customer">
            <SelectVehicle />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute role="customer">
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute role="customer">
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute role="customer">
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customize/build"
        element={
          <ProtectedRoute role="customer">
            <Customize />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customize/review"
        element={
          <ProtectedRoute role="customer">
            <Review />
          </ProtectedRoute>
        }
      />
      <Route
        path="/garage"
        element={
          <ProtectedRoute role="customer">
            <MyGarage />
          </ProtectedRoute>
        }
      />
      {/* Public — anyone with the link can view (not edit) a shared build. */}
      <Route path="/shared/:token" element={<SharedBuild />} />
      <Route path="/" element={<HomeRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}