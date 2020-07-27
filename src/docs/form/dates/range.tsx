import React from 'react';
import Dates, { DateType } from '@lxjx/fr/lib/dates';

const RangeDemo = () => {
  return (
    <div>
      <div>
        <Dates type={DateType.DATE} range />
      </div>
      <div className="mt-24">
        <Dates type={DateType.MONTH} range />
      </div>
      <div className="mt-24">
        <Dates type={DateType.YEAR} range />
      </div>
      <div className="mt-24">
        <Dates type={DateType.DATE} hasTime range />
      </div>
      <div className="mt-24">
        <Dates type={DateType.TIME} range />
      </div>
    </div>
  );
};

export default RangeDemo;
