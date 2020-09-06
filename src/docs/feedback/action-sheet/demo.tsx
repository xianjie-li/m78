import React from 'react';
import ActionSheet from 'm78/action-sheet';
import 'm78/action-sheet/style';

import Button from 'm78/button';
import 'm78/button/style';

const options = [
  {
    label: '操作1',
    value: 1,
  },
  {
    label: '高亮操作',
    value: 2,
    desc: '对此操作的详细描述',
    highlight: true,
  },
  {
    label: '禁用',
    value: 3,
    disabled: true,
  },
  {
    label: '操作4',
    value: 4,
  },
];

const Demo = () => {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setShow2(prev => !prev)}>直接选择</Button>
      <ActionSheet />
    </div>
  );
};

export default Demo;
