import React, {useContext} from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import {deleteTask, updateTask} from "../Api/Task";
import {DoneTaskContext} from "../_context/DoneTaskContext";
import {PendingTaskContext} from "../_context/PendingTaskContext";
import {getTasksForDate} from "../Common/Helper";
import {AppContext} from "../_context/AppContext";

const TaskListItem = ({done, task}) => {
  const labelId = `checkbox-list-label-${task.id}`;

  const [context, setContext] = useContext(AppContext);
  const [, setDoneTasks] = useContext(DoneTaskContext);
  const [, setPendingTasks] = useContext(PendingTaskContext);

  const DELETE_TASK = 'delete';
  const UPDATE_TASK = 'update';

  const processTask = (type, task) => async () => {
    setContext({loading: true});
    const date = !done ? context.currentDate : null;
    let request;
    switch (type) {
      case UPDATE_TASK:
        request = await updateTask(task, date);
        break;
      case DELETE_TASK:
        request = await deleteTask(task);
        break;
    }
    if (request) {
      const [pending, done] = await getTasksForDate(context.currentDate);
      setPendingTasks(pending.data);
      setDoneTasks(done.data);
      setContext({loading: false});
    }
  }

  return (
    <ListItem role={undefined} dense button onClick={processTask(UPDATE_TASK, task)}>
      <ListItemIcon>
        <Checkbox edge="start" checked={done} tabIndex={-1} disableRipple inputProps={{'aria-labelledby': labelId}}/>
      </ListItemIcon>
      <ListItemText id={labelId} primary={task.description}
                    secondary={task.start ? (task.start + ' - ' + task.end) : ''}/>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={processTask(DELETE_TASK, task)}>
          <DeleteOutlineIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default React.memo(TaskListItem);