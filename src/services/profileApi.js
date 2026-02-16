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
