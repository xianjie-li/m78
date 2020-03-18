import React from 'react';

import Input from '@lxjx/fr/lib/input';

const Demo = () => {
  return (
    <div>
      <div className="mt-16">
        <Input placeholder="自动获取焦点" autoFocus />
      </div>
      <div className="mt-16">
        <Input placeholder="搜索框" search onSearch={value => console.log(value)} />
      </div>
      <div className="mt-16">
        <Input placeholder="前导与后导内容" prefix="🍀" suffix="✨" />
      </div>
      <div className="mt-16">
        <Input placeholder="任意合法的ReactNode" prefix="邮箱" suffix="@qq.com" />
      </div>
      <div className="mt-16">
        <Input placeholder="一段密码" type="password" />
      </div>
      <div className="mt-16">
        <Input placeholder="加载状态" loading />
      </div>
      <div className="mt-16">
        <Input placeholder="阻塞型加载" blockLoading />
      </div>
      <div className="mt-16">
        <Input defaultValue="readOnly" readOnly />
      </div>
      <div className="mt-16">
        <Input placeholder="禁用" type="text" disabled />
      </div>
      <div className="mt-16">
        <Input placeholder="强调" status="info" />
      </div>
      <div className="mt-16">
        <Input placeholder="成功" status="success" />
      </div>
      <div className="mt-16">
        <Input placeholder="警告" status="warn" />
      </div>
      <div className="mt-16">
        <Input placeholder="失败" status="error" />
      </div>
      <div className="mt-16">
        <Input placeholder="我很小" size="small" suffix="一家人" />
      </div>
      <div className="mt-16">
        <Input placeholder="刚好够用" suffix="最重要的" />
      </div>
      <div className="mt-16">
        <Input placeholder="我超大" size="large" suffix="是整整齐齐" />
      </div>
      <div className="mt-16">
        <Input placeholder="请输入商品金额" type="number" size="big" prefix="￥" format="money" />
      </div>
      <div className="mt-16">
        <Input placeholder="无边框" notBorder />
      </div>
      <div className="mt-16">
        <Input placeholder="下边框" underline status="error" />
      </div>
    </div>
  );
};

export default Demo;
