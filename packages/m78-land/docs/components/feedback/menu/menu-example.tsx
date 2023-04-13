import React from "react";
import { Button, Menu } from "m78";
import { UseTriggerType } from "@m78/hooks";
import { menuData } from "./menu-data";

const ContextMenuExample = () => {
  return (
    <div>
      <Menu
        triggerType={UseTriggerType.click}
        options={menuData}
        onConfirm={(val, option) => {
          console.log(val, option);
        }}
      >
        <Button>click</Button>
      </Menu>
      <Menu
        triggerType={UseTriggerType.active}
        options={menuData}
        onConfirm={(val, option) => {
          console.log(val, option);
        }}
      >
        <Button>active</Button>
      </Menu>
      <Menu
        triggerType={UseTriggerType.contextMenu}
        options={menuData}
        onConfirm={(val, option) => {
          console.log(val, option);
        }}
      >
        <Button>contextMenu</Button>
      </Menu>
      <Menu
        triggerType={UseTriggerType.focus}
        options={menuData}
        onConfirm={(val, option) => {
          console.log(val, option);
        }}
      >
        <Button>focus</Button>
      </Menu>
    </div>
  );
};

export default ContextMenuExample;
