import { BOOKS_BASE } from '../config/api';

/**
 * Fetches a single book by ID (GET /api/books/books/:id).
 * Returns book with epubUrl, chapters, etc. No auth required.
 *
 * @param {string} bookId
 * @returns {Promise<{ data: object | null, error: string | null }>}
 */
export const getBookById = async (bookId) => {
  try {
    const res = await fetch(`${BOOKS_BASE}/books/${bookId}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { data: null, error: json.error || `Request failed (${res.status})` };
    }
    if (json && json.id) {
      return { data: json, error: null };
    }
    return { data: null, error: 'Invalid book response' };
  } catch (e) {
    return { data: null, error: e.message || 'Failed to fetch book' };
  }
};
