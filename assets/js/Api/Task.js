import client from "../Common/Client";

export const getTasks = (type, date) => client.get('/api/task/' + type + (date ? '?date=' + date : ''));

export const deleteTask = (task) => client.delete('/api/task/delete/' + task.id);

export const updateTask = (task, date) => client.patch('/api/task/' + task.id, {date: date})

export const addTask = (data) => client.post(
  '/api/task/add',
  {
    description: data.description,
    start: data.start,
    end: data.end,
    date: data.date,
  }
);