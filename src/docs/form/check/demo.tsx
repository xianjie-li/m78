import React, { useState } from 'react';

import Check from '@lxjx/fr/lib/check';

const Demo = () => {

  const [check, setCheck] = useState(false);

  return (
    <span>
      <div>{check.toString()}</div>
      <Check disabled label="禁用" />
      <Check label="选项1" autoFocus />
      <Check value="选项2" label="选项2" checked={check} onChange={(checked, value) => {
        console.log(checked, value);
        setCheck(checked);
      }} />
    </span>
  )
};

export default Demo;
