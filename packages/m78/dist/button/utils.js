import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import React from "react";
import { isArray } from "@m78/utils";
var matchIcon = /.?(Outlined|Filled|TwoTone|Icon)$/;
/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(通过name非严格匹配)，为其添加适当边距并返回 */ export function formatChildren(children) {
    var offset = 4;
    if (isArray(children)) {
        return children.map(function(child, index) {
            var type = child === null || child === void 0 ? void 0 : child.type;
            var name = "";
            if (type) {
                var ref, ref1;
                name = ((ref = type.render) === null || ref === void 0 ? void 0 : ref.displayName) || ((ref1 = type.render) === null || ref1 === void 0 ? void 0 : ref1.name) || type.name;
            }
            /* 为满足matchIcon规则的子元素添加边距 */ if (name && React.isValidElement(child) && matchIcon.test(name)) {
                var ref2;
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
                var newStyle = _object_spread({}, injectStyle, (ref2 = child.props) === null || ref2 === void 0 ? void 0 : ref2.style);
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
