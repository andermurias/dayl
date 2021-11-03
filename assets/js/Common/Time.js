import {format as dateFormat, endOfWeek as dateEndOfWeek, startOfWeek as dateStartOfWeek} from 'date-fns';
import {es, enGB} from 'date-fns/locale';

export const locales = {en: enGB, es: es};

export const format = (date, formatStr) =>
  dateFormat(date, formatStr, {
    locale: locales[window.__localeId__],
    weekStartsOn: 2,
  });

export const endOfWeek = (date) =>
  dateEndOfWeek(date, {
    locale: locales[window.__localeId__],
  });

export const startOfWeek = (date) =>
  dateStartOfWeek(date, {
    locale: locales[window.__localeId__],
  });
