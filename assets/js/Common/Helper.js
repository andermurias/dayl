export const logout = () => {
  localStorage.clear();
  document.cookie = 'logged=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/;';
  window.location.href = '/login';
};

export const getForcedTheme = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('theme');
};
