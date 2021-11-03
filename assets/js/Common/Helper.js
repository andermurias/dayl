import {differenceInDays, intervalToDuration, parse, parseISO} from 'date-fns';
import {format} from './Time';

export const logout = () => {
  localStorage.clear();
  document.cookie = 'logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/login';
};

export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const THEME_AUTO = 'auto';

export const saveTheme = (theme) => {
  theme && theme === THEME_AUTO ? localStorage.removeItem('theme') : localStorage.setItem('theme', theme);
};

export const getSavedTheme = () => localStorage.getItem('theme');

export const getThemeFromURl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('theme');
};

export const checkAndUpdateTheme = () => {
  const theme = getThemeFromURl() || getSavedTheme() || THEME_AUTO;
  saveTheme(theme);
};

export const taskHighlighter = (description, classes) =>
  (description || '').replace(/([\w\s_\-\\\/]*:)/g, '<span class="' + classes + '">$1</span>');

export const generateList = (length) => Object.keys(new Array(length).fill());

export const formatDurationToHours = (duration) =>
  ('' + duration.hours).padStart(2, '0') + ':' + ('' + duration.minutes).padStart(2, '0');

export const getDiffTime = (start, end) => {
  const duration = intervalToDuration({end: parse(end, 'HH:mm', new Date()), start: parse(start, 'HH:mm', new Date())});

  return formatDurationToHours(duration);
};
export const getDiffDays = (start, end) =>
  differenceInDays(parse(start, 'yyyy-MM-dd', new Date()), parse(end, 'yyyy-MM-dd', new Date()));

export const getDeadlineTextAsDate = (task) => task.deadline && format(parseISO(task.deadline, new Date()), 'P');

export const getDeadlineTextAsTimeDiff = (task) =>
  task.deadline ? differenceInDays(parseISO(task.deadline, new Date()), new Date()) : null;

export const getDeadlineData = (task) => ({
  date: getDeadlineTextAsDate(task),
  remaining: getDeadlineTextAsTimeDiff(task),
});

export const displayRemainingDays = (task) => !task.date && task.deadline != null;

export const getTaskDuration = (task) => task.start && task.end && getDiffTime(task.start, task.end);
