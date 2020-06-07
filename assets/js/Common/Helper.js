import {getTasks} from '../Api/Task';

export const isAuthenticated = () => localStorage.getItem('token');

export const getTasksForDate = (date) => Promise.all([getTasks('pending', null), getTasks('done', date)]);

export const logout = () => {
  localStorage.clear();
  document.cookie = 'logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/login';
};

export const getForcedTheme = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('theme');
};
