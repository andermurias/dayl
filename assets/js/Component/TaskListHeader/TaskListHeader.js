import React, {useState} from 'react';

import PropTypes from 'prop-types';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames/bind';

import moment from 'moment';
import {subDays, addDays} from 'date-fns';
import {format, startOfWeek, endOfWeek} from '../../Common/Time';

import Box from '@mui/material/Box';
import Hidden from '@mui/material/Hidden';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import {makeStyles, useTheme} from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Paper from '@mui/material/Paper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import DatePicker from '@mui/lab/DatePicker';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import {useTaskApi} from '../../_hook/useTaskApi';

import Link from '../../Atom/Link';

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
    padding: `${theme.spacing(3)} ${theme.spacing(3)}`,
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

  const [selectedDate, setSelectedDate] = useState(format(currentDate, 'yyyy-MM-dd'));
  const [pickerStatus, setPickerStatus] = useState(false);

  const prevDate = format(subDays(currentDate, 1), 'yyyy-MM-dd');
  const nexDate = format(addDays(currentDate, 1), 'yyyy-MM-dd');

  const onChangeDate = (date) => {
    setSelectedDate(date);
    history.push('/tasks/' + format(date, 'yyyy-MM-dd'));
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
            {format(currentDate, 'EEEE')}
          </Typography>
        </Grid>
        <Grid container item xs={2} sm={4} justifyContent="flex-end" alignItems="flex-end">
          <IconButton
            aria-label="more"
            aria-controls="tasks-menu"
            aria-haspopup="true"
            onClick={handleMoreMenuClick}
            size="large">
            <MoreVertIcon fontSize="large" />
          </IconButton>
          <Menu
            id="tasks-menu"
            anchorEl={moreMenuAnchorEl}
            keepMounted
            open={Boolean(moreMenuAnchorEl)}
            onClose={handleMoreMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => getExportTask(format(currentDate, 'yyyy-MM-dd'))}>
              <ListItemIcon>
                <ImportExportIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{t('tasks.export')}</Typography>
            </MenuItem>
          </Menu>
        </Grid>
        <Grid container item xs={6} sm={8} alignItems="center">
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
              renderInput={props => null}
            />
          <Typography variant="h6" component="h2" className={classes.title} onClick={() => setPickerStatus(true)}>
            <span className={classes.titleSecondary}>({format(currentDate, isSmallOrUp ? 'PPPPPP' : 'P')})</span>
          </Typography>
        </Grid>
        <Grid container item xs={6} sm={4} justifyContent="flex-end">
          <IconButton aria-label="prev" component={Link} to={'/tasks/' + prevDate} size="large">
            <ChevronLeftIcon fontSize="large" />
          </IconButton>
          <IconButton aria-label="next" component={Link} to={'/tasks/' + nexDate} size="large">
            <ChevronRightIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
      <Hidden smDown>
        <Box my={2}>
          <Grid container spacing={1}>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.left)}>
                {t('tasks.header.week')} {format(currentDate, 'w')}
              </Typography>
            </Grid>
            <Grid container item sm={6} xs={12}>
              <Typography variant="overline" component="h3" className={classNames(classes.subtitle, classes.right)}>
                {format(startOfWeek(currentDate), 'P')} - {format(endOfWeek(currentDate), 'P')}
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
