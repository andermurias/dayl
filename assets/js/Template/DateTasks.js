import React, {useEffect, useState} from "react";
import {withRouter, useParams} from "react-router-dom";
import axios from "axios";
import moment from 'moment';

const getTasks = (type, date) => {
  return axios.get(
    process.env.API_URL + '/api/task/' + type + (date ? '?date=' + date : ''),
    {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    })

}

const DateTasks = ({date, location}) => {
  const [doneTasks, setDoneTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  const query = useParams();
  const currentDate = query.date || moment().format('YYYY-MM-DD');

  useEffect(() => {
    getTasks('pending', query.date).then(res => setPendingTasks(res.data));
    getTasks('done', query.date).then(res => setDoneTasks(res.data));
  }, []);

  const changeTaskStatus = (task, date) => (e) => {
    axios.post(
      process.env.API_URL + '/api/task/' + task.id,
      {
        date: date
      },
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        }
      }).then(() => {
      console.log('Updated Successfully!');
      window.location.reload();
    })
  }

  return (
    <>
      <h2>Pending {query.date}</h2>
      <ul>
        {pendingTasks.map(
          (task, i) => <li key={i} onClick={changeTaskStatus(task,currentDate)}>{task.id} - {task.description}</li>)
        }
      </ul>
      <hr/>
      <h2>Done {query.date}</h2>
      <ul>
        {doneTasks.map(
          (task, i) => <li key={i} onClick={changeTaskStatus(task)}>{task.id} - {task.description}</li>)
        }
      </ul>
    </>
  );
}

export default withRouter(DateTasks);