import { PROFILE_BASE } from '../config/api';

/**
 * Fetches the current user's profile (requires auth).
 * @param {string} token - Bearer token
 * @returns {Promise<{ profilePhoto, userName, wolioId, userBio, location, joinedYear, userCourses, activity, achievements }>}
 */
export const getProfile = async (token) => {
  const res = await fetch(PROFILE_BASE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to fetch profile');
    err.status = res.status;
    throw err;
  }
  return data;
};

/**
 * Updates the current user's profile (requires auth).
 * @param {string} token - Bearer token
 * @param {{ userName?: string, userBio?: string, location?: string }} payload
 * @returns {Promise<{ profilePhoto, userName, wolioId, userBio, location, joinedYear, userCourses, activity, achievements }>}
 */
export const updateProfile = async (token, payload) => {
  const res = await fetch(PROFILE_BASE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Failed to update profile');
    err.status = res.status;
    throw err;
  }
  return data;
};
