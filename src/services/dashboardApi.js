import { DASHBOARD_BASE } from '../config/api';

const EMPTY_DASHBOARD = {
  userName: 'Guest Learner',
  currentDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
  userStats: {
    todayTimeSpentHours: 2.7,
    userStreak: 15,
    userTaskDone: { taskDone: 0, totalTask: 3 },
  },
  weekAnalysis: [
    { hours: 1.2 }, { hours: 2.1 }, { hours: 1.8 }, { hours: 2.5 }, { hours: 1.5 }, { hours: 0.2 }, { hours: 0 },
  ],
  totalTimeThisWeek: 12.3,
  averageTimePerDay: 1.8,
  continueLearning: [
    { bookName: 'Quantum Mechanics', chapterNumber: 12, chapterName: 'Wave Functions', totalChapters: 18, progressPercentage: 67, timeLeftHours: 0.47 },
    { bookName: 'Calculus Fundamentals', chapterNumber: 8, chapterName: 'Integration', totalChapters: 15, progressPercentage: 47, timeLeftHours: 0.58 },
  ],
  todayTasks: [
    { taskTitle: 'Complete Physics Quiz', taskDueTime: '2:00 PM', taskCourse: 'Physics', priority: 'high' },
    { taskTitle: 'Read Chapter 5', taskDueTime: '5:00 PM', taskCourse: 'Mathematics', priority: 'medium' },
    { taskTitle: 'Review notes', taskDueTime: '8:00 PM', taskCourse: 'Biology', priority: 'low' },
  ],
};

/**
 * Fetches dashboard data. Returns placeholder when no token or API fails.
 * @param {string} [token] - Optional Bearer token
 * @returns {Promise<object>} Dashboard data (real or placeholder)
 */
export const getDashboardData = async (token) => {
  if (!token) return EMPTY_DASHBOARD;
  try {
    const res = await fetch(DASHBOARD_BASE, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success && json.data) return json.data;
  } catch (e) {
    // ignore
  }
  return EMPTY_DASHBOARD;
};
