import React, { useRef, useState } from "react";
import { Menu, MenuOption, MenuProps } from "../../menu/index.js";
import { OverlayInstance } from "../../overlay/index.js";
import { useFn, useSelf } from "@m78/hooks";
import { TupleNumber } from "@m78/utils";
import { Trigger, TriggerType, UseTriggerProps } from "../../trigger/index.js";
import { _useCellMenu } from "./use-cell-menu.js";
import { _injector } from "../table.js";
import { _useMethodsAct } from "../injector/methods.act.js";
import { _useStateAct } from "../injector/state.act.js";

export type _TableContextMenuOpenOpt = {
  /** 菜单位置 */
  xy: TupleNumber;
  /** 选择后的回调 */
  cb?: MenuProps["onConfirm"];
  /** 菜单配置 */
  menu?: MenuOption[];
};

export const _useContextMenuAct = () => {
  const { state } = _injector.useDeps(_useStateAct);
  const methods = _injector.useDeps(_useMethodsAct);

  const ref = useRef<OverlayInstance>(null!);

  const self = useSelf({
    /** 最后开启菜单的回调 */
    callback: null as null | MenuProps["onConfirm"],
  });

  const [options, setOptions] = useState<MenuOption[]>([]);

  const cellMenuGet = _useCellMenu();

  // 在指定位置开启menu, 传入menu可替换当前菜单
  const open = useFn((opt: _TableContextMenuOpenOpt) => {
    const { menu, xy, cb } = opt;

    self.callback = cb || null;

    if (menu) {
      setOptions(menu);
    }

    ref.current.updateXY(xy, true);
    ref.current.setOpen(true);
  });

  const confirm: NonNullable<MenuProps["onConfirm"]> = useFn((val, option) => {
    self.callback?.(val, option);
  });

  const trigger: NonNullable<UseTriggerProps["onTrigger"]> = useFn((e) => {
    if (state.initializing) return;

    const cellOpenOpt = cellMenuGet(e);

    if (cellOpenOpt) {
      open(cellOpenOpt);
      return;
    }
  });

  function renderTrigger(child: React.ReactElement) {
    return (
      <Trigger type={TriggerType.contextMenu} onTrigger={trigger}>
        {child}
      </Trigger>
    );
  }

  return {
    open,
    node: (
      <Menu
        instanceRef={ref}
        options={options}
        onConfirm={confirm}
        onChange={methods.overlayStackChange}
      />
    ),
    renderTrigger,
  };
};
