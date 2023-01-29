import React from "react";
import { Input, InputType } from "../../src/input";
import { Cell, Cells } from "../../src/layout/index.js";

const InputExample = () => {
  return (
    <Cells>
      <Cell col={6}>
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
          <Input
            placeholder="任意合法的ReactNode"
            prefix="邮箱"
            suffix="@qq.com"
          />
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
          <Input placeholder="无边框" border />
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
      </Cell>

      <Cell col={6}>
        <div>
          <Input type={InputType.number} placeholder="只能输入数字" />
        </div>
        <div className="mt-16">
          <Input type={InputType.integer} placeholder="只能输入整数" />
        </div>
        <div className="mt-16">
          <Input
            type={InputType.positiveInteger}
            placeholder="只能输入正整数"
            autoFocus
          />
        </div>
        <div className="mt-16">
          <Input
            type={InputType.number}
            max={1000}
            min={-1000}
            placeholder="最小-1000, 最大1000"
          />
        </div>
        <div className="mt-16">
          <Input
            type={InputType.number}
            placeholder="步进器"
            stepper
            min={-10}
            max={10}
          />
        </div>
        <div className="mt-16">
          <Input
            type={InputType.number}
            placeholder="步进器"
            stepper={3}
            min={-10}
            max={10000}
          />
        </div>
      </Cell>
    </Cells>
  );
};

export default InputExample;
