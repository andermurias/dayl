import React, {useState} from 'react';

import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames/bind';

import moment from 'moment';
import MomentUtils from '@date-io/moment';

import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import {useTaskApi} from '../_hook/useTaskApi';

import Link from '../Atom/Link';

const useStyles = makeStyles((theme) => ({
  title: {
    textTransform: 'capitalize',
    textAlign: 'left',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  subtitle: {
    width: '100%',
    textTransform: 'uppercase',
    lineHeight: 1.5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  left: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'left',
    },
  },
  right: {
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      textAlign: 'right',
    },
  },
  titleSecondary: {
    opacity: '.3',
    fontWeight: 'regular',
  },
  datePicker: {
    display: 'none',
  },
  paper: {
    width: '100%',
    padding: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
    background: 'transparent',
  },
}));

const TaskListHeader = ({currentDate}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallOrUp = useMediaQuery(theme.breakpoints.up('sm'));
  const {getExportTask} = useTaskApi();

  const history = useHistory();
  const {t} = useTranslation();

  const [selectedDate, setSelectedDate] = useState(moment(currentDate).format('YYYY-MM-DD'));
  const [pickerStatus, setPickerStatus] = useState(false);

  const prevDate = moment(currentDate).subtract(1, 'day').format('YYYY-MM-DD');
  const nexDate = moment(currentDate).add(1, 'day').format('YYYY-MM-DD');

  const onChangeDate = (date) => {
    setSelectedDate(date);
    history.push('/tasks/' + moment(date).format('YYYY-MM-DD'));
  };

  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState(null);

  const handleMoreMenuClick = (event) => {
    setMoreMenuAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchorEl(null);
  };

  return (
    <Paper className={classes.paper} elevation={0}>
      <Grid container spacing={1}>
        <Grid container item xs={10} sm={8}>
          <Typography variant="h2" component="h1" className={classes.title} onClick={() => setPickerStatus(true)}>
            {currentDate.format('dddd')}
          </Typography>
        </Grid>
        <Grid container item xs={2} sm={4} justify="flex-end" alignItems="flex-end">
          <IconButton aria-label="more" aria-controls="tasks-menu" aria-haspopup="true" onClick={handleMoreMenuClick}>
            <MoreVertIcon fontSize="large" />
          </IconButton>
          <Menu
            id="tasks-menu"
            anchorEl={moreMenuAnchorEl}
            keepMounted
            open={Boolean(moreMenuAnchorEl)}
            onClose={handleMoreMenuClose}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => getExportTask(currentDate.format('YYYY-MM-DD'))}>
              <ListItemIcon>
                <ImportExportIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{t('tasks.export')}</Typography>
            </MenuItem>
          </Menu>
        </Grid>
        <Grid container item xs={6} sm={10} alignItems="center">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              autoOk
              label="Date Picker"
              showTodayButton={true}
              todayLabel={t('tasks.today')}
              cancelLabel={t('tasks.cancel')}
              okLabel={t('tasks.ok')}
              value={selectedDate}
              open={pickerStatus}
              onOpen={() => setPickerStatus(true)}
              onAccept={() => setPickerStatus(false)}
              onClose={() => setPickerStatus(false)}
              onChange={onChangeDate}
              TextFieldComponent={() => null}
            />
          </MuiPickersUtilsProvider>
          <Typography variant="h6" component="h2" className={classes.title} onClick={() => setPickerStatus(true)}>
            <span className={classes.titleSecondary}>({moment(currentDate).format(isSmallOrUp ? 'LL' : 'L')})</span>
          </Typography>
        </Grid>
        <Grid container item xs={6} sm={2} justify="flex-end">
          <IconButton aria-label="prev" component={Link} to={'/tasks/' + prevDate}>
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton aria-label="next" component={Link} to={'/tasks/' + nexDate}>
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Hidden xsDown>
        <Box my={2}>
          <Grid container spacing={1}>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.left)}>
                {t('tasks.header.week')} {moment(currentDate).format('w')}
              </Typography>
            </Grid>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.right)}>
                {moment(currentDate).startOf('week').format('L')} - {moment(currentDate).endOf('week').format('L')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Hidden>
    </Paper>
  );
};

TaskListHeader.propTypes = {
  currentDate: PropTypes.objectOf(moment),
};

export default React.memo(TaskListHeader);
