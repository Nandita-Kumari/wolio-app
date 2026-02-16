import { DASHBOARD_BASE } from '../config/api';

/**
 * Fetches dashboard data (stats, week chart, continue learning, tasks).
 * @param {string} [token] - Optional Bearer token when backend requires auth
 * @returns {Promise<{ userName, userStats, weekAnalysis, totalTimeThisWeek, averageTimePerDay, continueLearning, todayTasks, ... }>}
 */
export const getDashboardData = async (token) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(DASHBOARD_BASE, { headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.error || 'Failed to fetch dashboard data');
    err.status = res.status;
    throw err;
  }
  if (!json.success || !json.data) {
    throw new Error('Invalid dashboard response');
  }
  return json.data;
};
