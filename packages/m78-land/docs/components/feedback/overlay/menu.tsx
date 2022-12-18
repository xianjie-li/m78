import React from "react";
import { Overlay, OverlayDirection } from "m78/overlay";
import { Button } from "m78/button";
import { IconArrowForwardIos } from "@m78/icons/icon-arrow-forward-ios";

import css from "./style.module.scss";

import { menuConfig } from "./menu-config";
import { UseTriggerType } from "@m78/hooks";
import clsx from "clsx";

const Menu = () => {
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
        direction={OverlayDirection.rightStart}
        triggerType={UseTriggerType.active}
        childrenAsTarget
        content={<div className={css.menu}>{renderMenuList(menuConfig)}</div>}
      >
        <Button>open menu</Button>
      </Overlay>
    </div>
  );
};

export default Menu;
