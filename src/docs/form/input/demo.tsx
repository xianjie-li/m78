import React from 'react';

import Input from '@lxjx/flicker/lib/input';
import Icon from '@lxjx/flicker/lib/icon';

const Demo = () => {
  return (
    <div>
      <div className="mt-16">
        <Input defaultValue="前导图标与后导图标" prefix="🍀" suffix={<Icon style={{ cursor: 'pointer' }} size="large" type="search" />} />
      </div>
      <div className="mt-16">
        <Input defaultValue="清除按钮" />
      </div>
      <div className="mt-16">
        <Input defaultValue="一段密码" type="password" />
      </div>
      <div className="mt-16">
        <Input defaultValue="自动获取焦点" autoFocus />
      </div>
      <div className="mt-16">
        <Input defaultValue="设置为加载状态" loading />
      </div>
      <div className="mt-16">
        <Input defaultValue="阻塞型加载" blockLoading />
      </div>
      <div className="mt-16">
        <Input defaultValue="只读状态" readOnly />
      </div>
      <div className="mt-16">
        <Input defaultValue="禁用" type="text" disabled />
      </div>
    </div>
  );
};

export default Demo;
