import { EXPLORE_BASE } from '../config/api';

/**
 * Fetches explore page data (stats, trending, categories, featured courses).
 * @param {string} [token] - Bearer token (required; explore endpoint is protected).
 * @returns {Promise<{ totalRegisteredCourses, totalAppUsers, todayNewUsers, trendingNow, browseCategories, featuredCourses }>}
 */
export const getExploreData = async (token) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(EXPLORE_BASE, { headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error || 'Failed to fetch explore data');
    err.status = res.status;
    throw err;
  }
  if (!json.success || !json.data) {
    throw new Error('Invalid explore response');
  }
  return json.data;
};
