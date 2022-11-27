import React from 'react';

import { useSelf } from '@m78/hooks';

const UseSetStateDemo = () => {
  const self = useSelf({ count: 0, other: 'lxj' });

  const get = React.useCallback(() => {
    alert(self.count); // 由于是实例属性，不会受到闭包影响
  }, []);

  const set = React.useCallback(() => {
    self.count = Math.random();
  }, []);

  return (
    <div>
      <button onClick={set}>改变值</button>
      <button onClick={get}>输出</button>
    </div>
  );
};

export default UseSetStateDemo;
