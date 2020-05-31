import {getTasks} from "../Api/Task";

export const getTasksForDate = async (date) => {
  return Promise.all([
    getTasks('pending', null),
    getTasks('done', date)
  ]);
}

export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
}