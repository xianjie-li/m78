import React from 'react';
import ActionSheet from 'm78/action-sheet';
import 'm78/action-sheet/style';

import Button from 'm78/button';
import 'm78/button/style';

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

function showApi() {
  setTimeout(() => {
    const [ref, id] = ActionSheet.api({
      options,
      title: '标题',
      onChange(option) {
        console.log(option);
      },
      onConfirm(option) {
        console.log(2, option);
      },
    });
    console.log(ref, id);
  });
}

const Demo = () => (
  <div>
    <Button onClick={showApi}>toggle</Button>
  </div>
);

export default Demo;
