import React, {useEffect, useState} from "react";
import {withRouter, useParams} from "react-router-dom";
import axios from "axios";

const getTasks = (type, date) => {
  console.log(date);
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
          (task, i) => <li key={i} onClick={changeTaskStatus(task, query.date)}>{task.id} - {task.description}</li>)
        }
      </ul>
      <hr/>
      <h2>Done {query.date}</h2>
      <ul>
        {doneTasks.map(
          (task, i) => <li key={i} onClick={changeTaskStatus(task, query.date)}>{task.id} - {task.description}</li>)
        }
      </ul>
    </>
  );
}

export default withRouter(DateTasks);