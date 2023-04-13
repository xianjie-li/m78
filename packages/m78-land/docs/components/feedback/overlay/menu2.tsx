import React from "react";
import { Overlay, OverlayDirection, Button } from "m78";
import { IconArrowForwardIos } from "@m78/icons/icon-arrow-forward-ios";

import css from "./style.module.scss";

import { menuConfig } from "./menu-config";
import { useSetState, UseTriggerType } from "@m78/hooks";
import clsx from "clsx";

const Menu = () => {
  // 这里是故意使用useSetState的, 因为state.type可以帮助我们实时获取到最新的type
  const [state, setState] = useSetState({
    type: UseTriggerType.click,
  });

  function renderMenuList(list: any[]) {
    return list.map((item) => {
      if (item.children?.length) {
        return (
          <Overlay
            key={item.label}
            content={
              <div className={css.menu}>{renderMenuList(item.children)}</div>
            }
            direction={OverlayDirection.rightStart}
            triggerType={UseTriggerType.active}
            childrenAsTarget
          >
            {({ open }) => (
              <div className={clsx(css.listItem, open && css.listItemActive)}>
                {item.label}
                <IconArrowForwardIos className="color-second fs-12" />
              </div>
            )}
          </Overlay>
        );
      } else {
        return (
          <div key={item.label} className={css.listItem}>
            {item.label}
          </div>
        );
      }
    });
  }

  return (
    <div>
      <Overlay
        triggerType={state.type}
        onChange={(open) => {
          const next = open ? UseTriggerType.active : UseTriggerType.click;
          if (next === state.type) return;
          setState({ type: next });
        }}
        direction={OverlayDirection.rightStart}
        childrenAsTarget
        content={<div className={css.menu}>{renderMenuList(menuConfig)}</div>}
      >
        <Button>open menu</Button>
      </Overlay>
    </div>
  );
};

export default Menu;
