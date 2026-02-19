import { EXPLORE_BASE } from '../config/api';

/**
 * Fetches explore data from existing backend (GET /api/explore).
 * Accepts both { success, data } and raw payload. Never throws; returns { data, error }.
 *
 * @param {string} [token] - Bearer token (explore route uses protect middleware).
 * @returns {Promise<{ data: object | null, error: string | null }>}
 */
export const getExploreData = async (token) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(EXPLORE_BASE, { headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { data: null, error: json.error || `Request failed (${res.status})` };
    }
    // Backend may return { success: true, data } or raw payload
    const data = json.success && json.data != null ? json.data : json;
    const hasData =
      data &&
      typeof data === 'object' &&
      (Array.isArray(data.trendingNow) ||
        Array.isArray(data.browseCategories) ||
        Array.isArray(data.featuredCourses) ||
        typeof data.totalRegisteredCourses === 'number');
    if (hasData) {
      return { data, error: null };
    }
    return { data: null, error: 'Invalid explore response' };
  } catch (e) {
    return { data: null, error: e.message || 'Failed to fetch explore data' };
  }
};
