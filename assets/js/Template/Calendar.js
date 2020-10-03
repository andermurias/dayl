import React, {useEffect, useContext, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import {useTaskApi} from '../_hook/useTaskApi';
import {AppContext} from '../_context/AppContext';
import {useTranslation} from 'react-i18next';
import {colors} from '../Common/Colors';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin from '@fullcalendar/interaction';

const useStyles = makeStyles((theme) => ({
  paper: {
    boxShadow: 'none',
    border: 0,
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(2),
    maxWidth: 1000,
    height: '80vh',
    width: '100%',
    margin: `${theme.spacing(1)}px auto`,
    //    background: 'transparent',
    '& .fc-daygrid-day-number': {
      ...theme.typography.caption,
    },
  },
}));

const Calendar = () => {
  const classes = useStyles();
  const history = useHistory();
  const query = useParams();

  const {i18n} = useTranslation();

  moment.locale(i18n.language);

  const {currentDate, setLoading} = useContext(AppContext);

  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);

  const [tasks, setTasks] = useState([]);

  const {getTasksForRange} = useTaskApi();

  const initialDate = query.date || moment(currentDate).format('YYYY-MM-01');

  useEffect(() => {
    setLoading(true);
    const start = moment(startDate).format('YYYY-MM-DD');
    const end = moment(endDate).format('YYYY-MM-DD');
    getTasksForRange({start, end}).then(({data}) => {
      setTasks(data.map((t) => ({title: t.description, date: t.date})));
      setLoading(false);
    });
  }, [endDate]);

  const onMonthChange = ({endStr, startStr, view}) => {
    const toDate = moment(view.getCurrentData().currentDate).format('YYYY-MM-DD');
    if (toDate !== query.date && toDate !== initialDate) {
      history.push('/calendar/' + moment(toDate).format('YYYY-MM-DD'));
    }
    setStartDate(startStr);
    setEndDate(endStr);
  };

  const goToDate = ({dateStr}) => history.push('/tasks/' + moment(dateStr).format('YYYY-MM-DD'));

  return (
    <Paper className={classes.paper} elevation={0}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={tasks}
        views={console.log}
        datesSet={onMonthChange}
        eventBackgroundColor={colors.orangePeel}
        eventBorderColor={colors.orangePeel}
        locales={[esLocale]}
        locale={i18n.locale}
        dateClick={goToDate}
        initialDate={initialDate}
        dayMaxEvents={4}
      />
    </Paper>
  );
};

export default React.memo(Calendar);
