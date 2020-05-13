import React from 'react';

import Check, { CheckCustom } from '@lxjx/fr/lib/check';
import './style.scss';
import cls from 'classnames';

const myCheck: CheckCustom = ({ checked, disabled, focus }, props) => (
  <span
    className={cls('MyCustomCheck', {
      __checked: checked,
      __disabled: disabled,
      __focus: focus,
    })}
  >
    {props.label}
  </span>
);

const Demo2 = () => (
  <div>
    <h3>还是选择你最爱的水果</h3>
    <Check label="🍉西瓜" customer={myCheck} />
    <Check label="🍌香蕉" customer={myCheck} />
    <Check disabled label="🍎苹果(缺货)" customer={myCheck} />
    <Check label="🍇葡萄" customer={myCheck} />
  </div>
);

export default Demo2;
