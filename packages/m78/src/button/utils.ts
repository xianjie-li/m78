import React from "react";
import { isArray } from "@m78/utils";

const matchIcon = /(Icon|icon)/;

/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(通过name非严格匹配)，为其添加适当边距并返回 */
export function _formatChildren(children: React.ReactNode): any[] {
  const offset = 4;

  if (isArray(children)) {
    return children.map((child, index) => {
      const type = child?.type;
      let name = "";

      if (type) {
        name =
          type.render?.displayName ||
          type.render?.name ||
          type.displayName ||
          type.name;
      }

      /* 为满足matchIcon规则的子元素添加边距 */
      if (name && React.isValidElement<any>(child) && matchIcon.test(name)) {
        let injectStyle: React.CSSProperties = {
          marginLeft: offset,
          marginRight: offset,
        };
        if (index === 0) {
          injectStyle = { marginRight: offset };
        }

        if (index === children.length - 1) {
          injectStyle = { marginLeft: offset };
        }

        const newStyle = { ...injectStyle, ...child.props?.style };

        return React.cloneElement(child, { style: newStyle });
      }
      return child;
    });
  }

  return [children];
}
