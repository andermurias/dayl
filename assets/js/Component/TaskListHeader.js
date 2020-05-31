import React from "react";

import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import {Link} from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Typography from "@material-ui/core/Typography";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import moment from "moment";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: `${theme.spacing(2)}px`,
    textTransform: 'capitalize',
    textAlign: 'center',
    width: '100%'
  },
  subtitle: {
    margin: `${theme.spacing(2)}px`,
    textTransform: 'capitalize',
    textAlign: "center",
    width: '100%'
  },
  titleSecondary: {
    opacity: '.3',
    fontWeight: 'regular'
  }
}));

const TaskListHeader = ({currentDate}) => {
  const classes = useStyles();

  const prevDate = moment(currentDate).subtract(1, 'day').format('YYYY-MM-DD');
  const nexDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');

  return (
    <>
      <Grid container spacing={1}>
        <Grid container item xs={2} sm={1}>
          <IconButton aria-label="prev" component={Link} to={'/tasks/' + prevDate}>
            <ChevronLeftIcon/>
          </IconButton>
        </Grid>
        <Grid container item xs={8} sm={10}>
          <Typography variant="h5" component="h1" className={classes.title}>
            {currentDate.format('dddd')} <br/> <span
            className={classes.titleSecondary}>({currentDate.format('LL')})</span>
          </Typography>
        </Grid>
        <Grid container item xs={2} sm={1}>
          <IconButton aria-label="next" component={Link} to={'/tasks/' + nexDate}>
            <ChevronRightIcon/>
          </IconButton>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid container item xs={12}>
          <Typography variant="h6" component="h2" className={classes.subtitle} color='textSecondary' gutterBottom>
            {currentDate.format('[W: ] w')} | {currentDate.startOf('week').format('L')} - {currentDate.endOf('week').format('L')}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

export default React.memo(TaskListHeader);