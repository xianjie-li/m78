import React from 'react';
import ActionSheet from '@lxjx/fr/action-sheet';
import '@lxjx/fr/action-sheet/style';

import Button from '@lxjx/fr/button';
import '@lxjx/fr/button/style';

const options = [
  {
    name: '操作1',
    id: 1,
  },
  {
    name: '高亮操作',
    id: 2,
    desc: '对此操作的详细描述',
    highlight: true,
  },
  {
    name: '禁用',
    id: 3,
    disabled: true,
  },
  {
    name: '操作4',
    id: 4,
  },
];

const Demo = () => {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);

  return (
    <div>
      <Button onClick={() => setShow(prev => !prev)}>toggle</Button>
      <Button onClick={() => setShow2(prev => !prev)}>直接选择</Button>
      <ActionSheet
        title="标题"
        show={show}
        defaultValue={{ id: 1, name: '操作1' }}
        onChange={option => console.log('change:', option)}
        onConfirm={option => console.log('confirm:', option)}
        onClose={() => setShow(false)}
        options={options}
      />
      <ActionSheet
        isConfirm={false}
        title="选择后直接关闭"
        show={show2}
        defaultValue={{ id: 1, name: '操作1' }}
        onChange={option => console.log('change:', option)}
        onConfirm={option => console.log('confirm:', option)}
        onClose={() => setShow2(false)}
        options={options}
      />
    </div>
  );
};

export default Demo;
