import {useApiClient} from './useApiClient';

export const useCalendarApi = () => {
  const {client} = useApiClient();

  const getCalendarEvents = (date) =>
    client.get('/api/calendar/events' + (date ? '?date=' + date : '')).catch(console.log);

  return {
    getCalendarEvents,
  };
};
