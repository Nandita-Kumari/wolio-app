import { LIBRARY_BASE } from '../config/api';

/**
 * Fetches library data from backend (GET /api/library).
 * Requires auth. Returns { success, data } with bookshelf, booksCompleted, recommendedBooks, etc.
 *
 * @param {string} token - Bearer token (required for protect middleware).
 * @returns {Promise<{ data: object | null, error: string | null }>}
 */
export const getLibraryData = async (token) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(LIBRARY_BASE, { headers });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { data: null, error: json.error || `Request failed (${res.status})` };
    }
    const data = json.success && json.data != null ? json.data : json;
    const hasData =
      data &&
      typeof data === 'object' &&
      (Array.isArray(data.bookshelf) ||
        Array.isArray(data.recommendedBooks) ||
        typeof data.todayReadingTime === 'number');
    if (hasData) {
      return { data, error: null };
    }
    return { data: null, error: 'Invalid library response' };
  } catch (e) {
    return { data: null, error: e.message || 'Failed to fetch library data' };
  }
};
