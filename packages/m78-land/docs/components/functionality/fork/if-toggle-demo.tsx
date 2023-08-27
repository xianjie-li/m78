import React from "react";
import { Divider, If, Toggle } from "m78";

const IfToggleDemo = () => {
  return (
    <div>
      <Divider>If</Divider>
      <If when={true}>
        <div>你看到我了 1</div>
      </If>
      <If when={false}>
        <div>你看不到我 2</div>
      </If>
      <If when={0}>
        <div>你看不到我 3</div>
      </If>
      <If when={123}>
        <div>你看到我了 4</div>
      </If>
      <If when>{() => <div>render用法, 条件成立后才会创建Element</div>}</If>

      <Divider>Toggle</Divider>
      <Toggle when>
        <div>你看到我了1</div>
      </Toggle>
      <Toggle when={false}>
        <div>你看不到我2</div>
      </Toggle>
      <Toggle when={0}>
        <div>你看不到我3</div>
      </Toggle>
      <Toggle when={123}>
        <div>你看到我了4</div>
      </Toggle>
      <Toggle when={false}>
        如果子节点是字符串或一组ReactElement, 会使用一个div作为包裹节点来挂载
        display: none
      </Toggle>
      <Toggle when={false}>
        <div>你看不到我</div>
        <div>你看不到我</div>
        <div>你看不到我</div>
        <div>你看不到我</div>
        <div>你看不到我</div>
      </Toggle>
    </div>
  );
};

export default IfToggleDemo;
