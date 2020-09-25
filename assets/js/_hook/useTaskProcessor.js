import {useContext} from 'react';

import {useTaskApi} from './useTaskApi';
import {AppContext} from '../_context/AppContext';

export const DELETE_TASK = 'delete';
export const EDIT_TASK = 'edit';
export const ADD_TASK = 'add';
export const UPDATE_TASK = 'update';
export const UPDATE_STATUS_TASK = 'update_status';
export const DUPLICATE_TASK = 'duplicate';
export const DUPLICATE_EMPTY_TASK = 'duplicate_empty';

export const useTaskProcessor = () => {
  const {setLoading, currentDate, setEditTask, editTask} = useContext(AppContext);
  const {deleteTask, updateTask, getTasksForDateAndSave, addTask} = useTaskApi();

  const processTask = async (type, task) => {
    setLoading(true);
    let request = null;
    switch (type) {
      case EDIT_TASK:
        if (editTask && task.id === editTask.id) {
          setEditTask(null);
        } else {
          setEditTask(task);
        }
        setLoading(false);
        break;
      case UPDATE_TASK:
        request = await updateTask(task);
        break;
      case UPDATE_STATUS_TASK:
        request = await updateTask({
          ...task,
          date: task.date ? null : currentDate,
        });
        break;
      case DELETE_TASK:
        request = await deleteTask(task);
        break;
      case DUPLICATE_EMPTY_TASK:
        request = await addTask({
          ...task,
          start: null,
          end: null,
          date: null,
        });
        break;
      case DUPLICATE_TASK:
      case ADD_TASK:
        request = await addTask(task);
        break;
    }
    if (request) {
      await getTasksForDateAndSave(currentDate);
      setLoading(false);
    }
  };

  return {
    processTask,
  };
};
