import React from 'react';
import { Fork } from 'm78/fork';

const Demo = () => (
  <div>
    <Fork.Toggle when>
      <div>你看到我了1</div>
    </Fork.Toggle>
    <Fork.Toggle when={false}>
      <div>你看不到我2</div>
    </Fork.Toggle>
    <Fork.Toggle when={0}>
      <div>你看不到我3</div>
    </Fork.Toggle>
    <Fork.Toggle when={123}>
      <div>你看到我了4</div>
    </Fork.Toggle>
    <Fork.Toggle when={false}>
      字符串会生成一个包含display: none的div来包裹作为隐藏控制节点
    </Fork.Toggle>
    <Fork.Toggle when={false}>
      <div>如果是一组元素，则遍历为每一个挂载display: none</div>
      <div>你看不到我</div>
      <div>你看不到我</div>
      <div>你看不到我</div>
      <div>你看不到我</div>
      <div>你看不到我</div>
    </Fork.Toggle>
  </div>
);

export default Demo;
