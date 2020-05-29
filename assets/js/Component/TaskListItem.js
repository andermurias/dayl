import React from "react";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

import {deleteTask, updateTask} from "../Api/Task";

export const TaskListItem = ({done, currentDate, task, upd}) => {
  const labelId = `checkbox-list-label-${task.id}`;
  const onDeleteClick = (task) => (e) => deleteTask(task).then(() => {
    upd()
  });
  const changeTaskStatus = (task, date) => (e) => updateTask(task, date).then(() => {
    upd()
  });

  return (
    <ListItem role={undefined} dense button onClick={changeTaskStatus(task, currentDate)}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={done}
          tabIndex={-1}
          disableRipple
          inputProps={{'aria-labelledby': labelId}}
        />
      </ListItemIcon>
      <ListItemText id={labelId}
                    primary={task.description}
                    secondary={task.start ? (task.start + ' - ' + task.end) : ''}/>
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={onDeleteClick(task)}>
          <DeleteOutlineIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}