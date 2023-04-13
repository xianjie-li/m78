import React from "react";
import { Divider, If, Switch, Toggle } from "m78";

const SwitchDemo = () => {
  return (
    <div>
      <Divider>配合If</Divider>
      <Switch>
        <If when={false}>
          <div>你看不到我1</div>
        </If>
        <If when={false}>
          <div>你看不到我2</div>
        </If>
        <div>你看到我了3</div>
      </Switch>

      <Divider>配合toggle</Divider>
      <Switch>
        <Toggle when={false}>
          <div>你看不到我1</div>
        </Toggle>
        <Toggle when={false}>
          <div>你看不到我2</div>
        </Toggle>
        <Toggle when={123123}>
          <div>你看到我了3</div>
        </Toggle>
        <div>你看不到我4</div>
      </Switch>
    </div>
  );
};

export default SwitchDemo;
