import {useApiClient} from './useApiClient';

export const useTaskApi = () => {
  const {client} = useApiClient();

  const getTasks = (type, date) => client.get('/api/task/' + type + (date ? '?date=' + date : ''));

  const deleteTask = (task) => client.delete('/api/task/delete/' + task.id);

  const updateTask = (task, data) =>
    client.patch('/api/task/' + task.id, {
      description: data.description,
      start: data.start,
      end: data.end,
      date: data.date,
    });

  const addTask = (data) =>
    client.post('/api/task/add', {
      description: data.description,
      start: data.start,
      end: data.end,
      date: data.date,
    });

  const getTasksForDate = (date) => Promise.all([getTasks('pending', null), getTasks('done', date)]);

  return {
    getTasks,
    deleteTask,
    updateTask,
    addTask,
    getTasksForDate,
  };
};
