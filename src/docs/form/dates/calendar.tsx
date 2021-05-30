import React from 'react';
import { Dates } from 'm78/dates';

const CalendarDemo = () => {
  return (
    <div style={{ maxWidth: '640px' }}>
      <Dates mode="calendar" />
    </div>
  );
};

export default CalendarDemo;
