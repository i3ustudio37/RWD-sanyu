import { YearRecord, CalendarEvent } from '../types';
import { INITIAL_RECORDS, INITIAL_EVENTS } from '../constants';

const EVENTS_KEY = 'sanyu_events_v1';
const RECORDS_KEY = 'sanyu_records_v1';

export const getEvents = (): CalendarEvent[] => {
  const stored = localStorage.getItem(EVENTS_KEY);
  if (!stored) {
    // Save initial events if nothing stored
    localStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  }
  return JSON.parse(stored);
};

export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const getRecords = (): YearRecord[] => {
  const stored = localStorage.getItem(RECORDS_KEY);
  if (!stored) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(INITIAL_RECORDS));
    return INITIAL_RECORDS;
  }
  return JSON.parse(stored);
};

export const saveRecords = (records: YearRecord[]) => {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
};