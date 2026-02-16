import { AUTH_BASE } from '../config/api';

const authFetch = async (endpoint, options = {}) => {
  const url = `${AUTH_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const signup = async (body) => {
  return authFetch('/signup', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export const verifyUser = async (email, otp) => {
  return authFetch('/verify', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
};

export const login = async (email, password) => {
  return authFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async (token) => {
  return authFetch('/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const forgotPassword = async (email) => {
  return authFetch('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

export const resetPassword = async (email, otp, password, confirmPassword) => {
  return authFetch('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, password, confirmPassword }),
  });
};
