import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ManageServices from './pages/ManageServices';
import AdminDashboard from './pages/AdminDashboard';
import SelectVehicle from './pages/SelectVehicle';

// Pass a role to restrict a route to a single role (e.g. role="admin").
// Omit it for any route that just needs "logged in, don't care which role".
function ProtectedRoute({ children, role }) {
  const { user, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'vendor') return <Navigate to="/services" replace />;
  if (user?.role === 'customer') return <Navigate to="/customize" replace />;
  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/services"
        element={
          <ProtectedRoute role="vendor">
            <ManageServices />
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
        path="/customize"
        element={
          <ProtectedRoute role="customer">
            <SelectVehicle />
          </ProtectedRoute>
        }
      />
      {/* Module 2 (Roadside Assistance Request) and Module 3 features
          get their own routes here as they're built. */}
      <Route path="/" element={<HomeRedirect />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
