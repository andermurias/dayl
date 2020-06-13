import {useApiClient} from './useApiClient';
import {useContext} from 'react';

import {DoneTaskContext} from '../_context/DoneTaskContext';
import {PendingTaskContext} from '../_context/PendingTaskContext';

export const useTaskApi = () => {
  const {client} = useApiClient();

  const [, setDoneTasks] = useContext(DoneTaskContext);
  const [, setPendingTasks] = useContext(PendingTaskContext);

  const getTasks = (type, date) =>
    client.get('/api/task/' + type + (date ? '?date=' + date : '')).catch((err) => {
      console.log(err);
    });

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

  const getTasksForDateAndSave = (date) =>
    getTasksForDate(date).then(([pending, done]) => {
      setPendingTasks(pending.data);
      setDoneTasks(done.data);
    });

  return {
    getTasks,
    deleteTask,
    updateTask,
    addTask,
    getTasksForDate,
    getTasksForDateAndSave,
  };
};
