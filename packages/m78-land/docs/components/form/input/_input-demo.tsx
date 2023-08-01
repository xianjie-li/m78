import React from "react";
import { Input } from "m78";

const InputDemo = () => (
  <div style={{ width: 360 }}>
    <div>
      <Input placeholder="一个输入框" />
    </div>
    <div className="mt-16">
      <Input
        placeholder="搜索框"
        search
        onSearch={(value) => console.log(value)}
      />
    </div>
    <div className="mt-16">
      <Input placeholder="前置与后置内容" prefix="🍀" suffix="✨" />
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
      <Input defaultValue="readOnly" readonly />
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
      <Input placeholder="警告" status="warning" />
    </div>
    <div className="mt-16">
      <Input placeholder="失败" status="error" />
    </div>
    <div className="mt-16">
      <Input placeholder="输入计数" charCount />
    </div>
    <div className="mt-16">
      <Input placeholder="小输入框" size="small" />
    </div>
    <div className="mt-16">
      <Input placeholder="中输入框" />
    </div>
    <div className="mt-16">
      <Input placeholder="大输入框" size="large" />
    </div>
    <div className="mt-16">
      <Input placeholder="无边框" border={false} />
    </div>
    <div className="mt-16">
      <Input
        placeholder="多行输入+最大长度+自动高度"
        textArea
        maxLength={400}
        status="error"
      />
    </div>
    <div className="mt-16">
      <Input
        placeholder="关闭自动高度"
        textArea
        autoSize={false}
        status="success"
      />
    </div>
  </div>
);

export default InputDemo;
