import React, { useState } from 'react';

import List from '@lxjx/flicker/lib/list';
import '@lxjx/flicker/lib/list/style';

import Button from '@lxjx/flicker/lib/button';
import '@lxjx/flicker/lib/button/style';

import { useSetState } from '@lxjx/hooks';

/* TODO: 完成表单输入组件后替换此页表单 */

const inpStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #ccc',
  outline: 'none',
  height: 34,
  borderRadius: 2,
  padding: '0 8px',
};

const initState = {
  layout: 'vertical' as 'horizontal' | 'vertical',
  column: 1,
  fullWidth: false,
  disabled: false,
};

const Demo = () => {
  const [state, setState] = useSetState({
    layout: 'vertical' as 'horizontal' | 'vertical',
    column: 1,
    disabled: false,
  });

  return (
    <div>
      <div>
        <Button onClick={() => {
          setState(prev => ({
            layout: prev.layout === 'vertical' ? 'horizontal' : 'vertical',
          }));
        }}
        >布局方式 | {state.layout}
        </Button>
        <Button onClick={() => {
          setState(prev => ({
            column: prev.column > 1 ? 1 : 3,
          }));
        }}
        >多列模式 | {state.column > 1 ? 'true' : 'false'}
        </Button>
        <Button onClick={() => {
          setState(prev => ({
            disabled: !prev.disabled,
          }));
        }}
        >禁用 | {state.disabled.toString()}
        </Button>
      </div>

      <List form {...state} className="mt-16">
        <List.Title
          title="个人信息填写"
          desc="填不填都行"
        />
        <List.Item
          title="姓名"
          extra="表单说明"
          footLeft="信息文本信息文本信息文本信息文本"
          status="error"
          require
        >
          <input type="text" placeholder="点击输入" style={inpStyle} />
        </List.Item>
        <List.Item
          title="地址"
          footLeft="信息文本信息文本信息文本信息文本"
          status="success"
        >
          <input type="text" placeholder="点击输入" style={inpStyle} />
        </List.Item>
        <List.Item
          title="出生年月"
          footLeft="信息文本信息文本信息文本信息文本"
          status="warning"
          require
        >
          <input type="text" placeholder="点击输入" style={inpStyle} />
        </List.Item>
        <List.Item
          title="自述"
          footLeft="信息文本信息文本信息文本信息文本"
        >
          <textarea placeholder="点击输入" style={{ ...inpStyle, minHeight: 64 }} />
        </List.Item>
        <List.Footer>
          <Button color="blue" size="large">提交</Button>
          <Button color="red">重置</Button>
        </List.Footer>
      </List>
    </div>
  );
};

export default Demo;
