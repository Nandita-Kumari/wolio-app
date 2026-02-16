import { EXPLORE_BASE } from '../config/api';

/**
 * Fetches explore page data (stats, trending, categories, featured courses).
 * @returns {Promise<{ totalRegisteredCourses, totalAppUsers, todayNewUsers, trendingNow, browseCategories, featuredCourses }>}
 */
export const getExploreData = async () => {
  const res = await fetch(EXPLORE_BASE);
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
