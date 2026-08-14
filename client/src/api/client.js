const API_BASE = 'http://localhost:5000/api';

// Every teammate's pages call the backend through this one helper, so the
// auth token is attached automatically and errors are handled consistently.
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('motofix_token');
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}
