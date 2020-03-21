import React from 'react';
import CountDown from '@lxjx/fr/lib/count-down';
import '@lxjx/fr/lib/count-down/style';

const d = new Date();

const Demo = () => (
  <div>
    <h3>大于30天: </h3>
    <CountDown date={new Date(d.getFullYear(), d.getMonth() + 2, 1)} />

    <h3 className="mt-24">10天后: </h3>
    <CountDown date={new Date(d.getFullYear(), d.getMonth(), d.getDate() + 10)} />

    <h3 className="mt-24">超时: </h3>
    <CountDown date="2008-08-08" />
  </div>
);

export default Demo;
