import React from 'react';

import ChoiceBox from '@lxjx/fr/lib/choice-box';

const Demo = () => (
  <span>
    <ChoiceBox disabled label="禁用" />
    <ChoiceBox label="选项1" autoFocus />
    <ChoiceBox label="选项2" defaultChecked />
  </span>
);

export default Demo;
