import React, { useState } from 'react';
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
  const [show, setShow] = useState(false);

  return (
    <div>
      <ActionSheet<number>
        defaultValue={2}
        onClose={(v, item) => {
          console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
          item && console.log('选项为:', item);
        }}
        options={options}
        triggerNode={<Button>常规使用</Button>}
      />

      <ActionSheet<number>
        confirm={false}
        onClose={(v, item) => {
          console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
          item && console.log('选项为:', item);
        }}
        options={options}
        triggerNode={<Button>直接选中模式</Button>}
      />

      <Button onClick={() => setShow(true)}>手动控制show</Button>
      <ActionSheet<number>
        show={show}
        onShowChange={nShow => setShow(nShow)}
        onClose={(v, item) => {
          console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
          item && console.log('选项为:', item);
        }}
        options={options}
      />

      <Button
        onClick={() => {
          ActionSheet.api({
            defaultValue: 2,
            options,
            onClose(v, item) {
              console.log(v, item);

              console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
              item && console.log('选项为:', item);
            },
          });
        }}
      >
        通过api调用
      </Button>
    </div>
  );
};

export default Demo;
