import { createContext, useContext, useState } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('motofix_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('motofix_token'));

  const login = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('motofix_token', data.token);
    localStorage.setItem('motofix_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  // Customers register directly. Vendors pay a one-time listing fee first —
  // the account itself only gets created once that payment clears (see
  // paymentController.completePayment) — so this goes through the payment
  // session endpoint instead and resolves to { tranId, gatewayUrl, amount }
  // rather than an account.
  const register = (formData) => {
    const path = formData.role === 'vendor' ? '/payments/vendor-listing-fee/init' : '/auth/register';
    return apiFetch(path, { method: 'POST', body: JSON.stringify(formData) });
  };

  const logout = () => {
    localStorage.removeItem('motofix_token');
    localStorage.removeItem('motofix_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem('motofix_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);