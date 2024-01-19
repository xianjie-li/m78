import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import React from "react";
import { isArray } from "@m78/utils";
var matchIcon = /(Icon|icon)/;
/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(通过name非严格匹配)，为其添加适当边距并返回 */ export function _formatChildren(children) {
    var offset = 4;
    if (isArray(children)) {
        return children.map(function(child, index) {
            var type = child === null || child === void 0 ? void 0 : child.type;
            var name = "";
            if (type) {
                var _type_render, _type_render1;
                name = ((_type_render = type.render) === null || _type_render === void 0 ? void 0 : _type_render.displayName) || ((_type_render1 = type.render) === null || _type_render1 === void 0 ? void 0 : _type_render1.name) || type.displayName || type.name;
            }
            /* 为满足matchIcon规则的子元素添加边距 */ if (name && React.isValidElement(child) && matchIcon.test(name)) {
                var _child_props;
                var injectStyle = {
                    marginLeft: offset,
                    marginRight: offset
                };
                if (index === 0) {
                    injectStyle = {
                        marginRight: offset
                    };
                }
                if (index === children.length - 1) {
                    injectStyle = {
                        marginLeft: offset
                    };
                }
                var newStyle = _object_spread({}, injectStyle, (_child_props = child.props) === null || _child_props === void 0 ? void 0 : _child_props.style);
                return React.cloneElement(child, {
                    style: newStyle
                });
            }
            return child;
        });
    }
    return [
        children
    ];
}
