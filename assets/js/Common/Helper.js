import {getTasks} from "../Api/Task";

export const getTasksForDate = (date) => Promise.all([
  getTasks('pending', null),
  getTasks('done', date)
]);

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
}

export const getForcedTheme = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('theme');
}