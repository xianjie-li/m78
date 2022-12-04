import React from "react";
import { Input, InputType } from "m78/input";

const InputDemo = () => (
  <div>
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
  </div>
);

export default InputDemo;
