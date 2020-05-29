import React, {useRef, useState} from "react";

import MomentUtils from "@date-io/moment";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import CheckOutlinedIcon from "@material-ui/icons/CheckOutlined";
import {MuiPickersUtilsProvider, TimePicker} from "@material-ui/pickers";
import {makeStyles} from "@material-ui/core/styles";
import {addTask} from "../Api/Task";

const useStyles = makeStyles((theme) => ({
  inputText: {
    marginTop: `${theme.spacing(2)}px`,
  },
  check: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: `${theme.spacing(2)}px`
  }
}));

export const NewTaskForm = ({upd}) => {
  const classes = useStyles();

  const [startDate, handlestartDateChange] = useState(new Date(new Date().setHours(0, 0, 0, 0)));
  const [endDate, handleEndDateChange] = useState(new Date(new Date().setHours(0, 0, 0, 0)));

  let tastDescriptionRef = useRef(null);

  const submitTask = (description) => {
    addTask({description: description}).then(() => {
      tastDescriptionRef.current.value = '';
      upd();
    })
  }

  const enterListenerSend = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      submitTask(ev.target.value)
    }
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <TextField id="task-description" className={classes.inputText} label="Description" variant="outlined"
                     fullWidth
                     onKeyPress={enterListenerSend}
                     inputRef={tastDescriptionRef}/>
        </Grid>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <Grid container item xs={4}>
            <TimePicker
              inputVariant='outlined'
              id="task-start"
              label="Start"
              minutesStep={5}
              className={classes.inputText}
              ampm={false}
              value={startDate}
              onChange={handlestartDateChange}
              fullWidth
            />
          </Grid>
          <Grid container item xs={4}>
            <TimePicker
              inputVariant='outlined'
              id="task-end"
              label="End"
              minutesStep={5}
              className={classes.inputText}
              ampm={false}
              value={endDate}
              onChange={handleEndDateChange}
              fullWidth
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid container item xs={4}>
          <FormControlLabel
            className={classes.check}
            control={
              <Switch
                checked={true}
                onChange={() => null}
                name="Done"
                color="secondary"
              />
            }
            label="Done"
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <Button
            className={classes.inputText}
            variant="outlined"
            color="secondary"
            size='large'
            fullWidth
            startIcon={<CheckOutlinedIcon/>}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>);
}