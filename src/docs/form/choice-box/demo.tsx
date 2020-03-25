import React, { useState } from 'react';

import ChoiceBox from '@lxjx/fr/lib/choice-box';

const Demo = () => {

  const [check, setCheck] = useState(false);

  return (
    <span>
      <div>{check.toString()}</div>
      <ChoiceBox disabled label="禁用" />
      <ChoiceBox label="选项1" autoFocus />
      <ChoiceBox value="选项2" label="选项2" checked={check} onChange={(checked, value) => {
        console.log(checked, value);
        setCheck(checked);
      }} />
    </span>
  )
};

export default Demo;
