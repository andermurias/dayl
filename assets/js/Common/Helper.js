import moment from 'moment';

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

export const getDiffTime = (start, end) => moment(end, 'HH:mm').diff(moment(start, 'HH:mm'));
