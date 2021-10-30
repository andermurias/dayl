import PropTypes from 'prop-types';

import {task} from './task';

export const day = {
  i: PropTypes.number,
  date: PropTypes.objectOf(Date),
  monthDay: PropTypes.number,
  weekDay: PropTypes.number,
  weekDayStr: PropTypes.string,
  url: PropTypes.string,
  tasks: PropTypes.arrayOf(PropTypes.shape(task)),
};

export const pagination = {
  current: PropTypes.string,
  next: PropTypes.string,
  prev: PropTypes.string,
};

export const month = {
  name: PropTypes.string,
  nameShort: PropTypes.string,
  number: PropTypes.number,
  start: PropTypes.date,
  end: PropTypes.date,
  days: PropTypes.number,
  tasksTotal: PropTypes.number,
  pagination: PropTypes.shape(pagination),
};

export const calendar = {
  month: PropTypes.shape(month),
  days: PropTypes.arrayOf(PropTypes.shape(day)),
};
