export const logout = () => {
  localStorage.clear();
  document.cookie = 'logged=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.location.href = '/login';
};

export const getForcedTheme = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('theme');
};

export const taskHighlighter = (description, classes) =>
  (description || '').replace(/([\w\s_\-\\\/]*:)/g, '<span class="' + classes + '">$1</span>');

export const generateList = (length) => Object.keys(new Array(length).fill());
