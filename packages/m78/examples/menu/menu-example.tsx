import React from "react";
import { Button, TriggerType } from "../../src/index.js";
import { Menu } from "../../src/menu/index.js";
import { menuData } from "./menu-data.js";

const ContextMenuExample = () => {
  return (
    <div>
      <Menu
        triggerType={TriggerType.click}
        options={menuData}
        onConfirm={(val, option) => {
          console.log(val, option);
        }}
      >
        <Button>click</Button>
      </Menu>
      <Menu
        triggerType={TriggerType.active}
        options={menuData}
        onConfirm={(val, option) => {
          console.log(val, option);
        }}
      >
        <Button>active</Button>
      </Menu>
      <Menu
        triggerType={TriggerType.contextMenu}
        options={menuData}
        onConfirm={(val, option) => {
          console.log(val, option);
        }}
      >
        <Button>contextMenu</Button>
      </Menu>
      <Menu
        triggerType={TriggerType.focus}
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
