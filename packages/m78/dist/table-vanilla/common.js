import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { isNumber } from "@m78/utils";
export var _prefix = "m78-table";
/** 用于在config.el上存储当前实例 */ export var _privateInstanceKey = "__M78TableInstance";
/** 用于在domEl上挂载是否为其是否为内部创建的信息 */ export var _privateScrollerDomKey = "__M78PrivateScrollerDom";
/** 可替换的文本 */ export var _defaultTexts = {
    pasteUnalignedRow: "Pasted rows does not match the number of selected rows",
    pasteUnalignedColumn: "Pasted column does not match the number of selected column",
    pasteSingleValueLimit: "Paste single value can't exceed {num} cell",
    paste: "can not paste to non editable cell",
    addRow: "add row",
    removeRow: "remove row",
    setValue: "update value",
    moveRow: "move row",
    moveColumn: "move column"
};
/** 解析rowKey##columnKey格式的字符串为[rowKey, columnKey], 数组长度为2表示解析正常 */ export function _getCellKeysByStr(s) {
    if (!s) return [];
    return s.split("##");
}
/** 根据行列索引获取其字符串形式的ind */ export function _getCellKey(rowKey, columnKey) {
    return "".concat(rowKey, "##").concat(columnKey);
}
/** 若是数字, 返回`${size}px`, 是字符串直接返回 */ export function _getSizeString(size) {
    return isNumber(size) ? "".concat(size, "px") : size;
}
/** 根据n个点获取最大Bound */ export function _getBoundByPoint() {
    for(var _len = arguments.length, pointers = new Array(_len), _key = 0; _key < _len; _key++){
        pointers[_key] = arguments[_key];
    }
    var ref = _sliced_to_array(_getMaxPointByPoint.apply(void 0, _to_consumable_array(pointers)), 2), p1 = ref[0], p2 = ref[1];
    var left = p1[0];
    var top = p1[1];
    return {
        left: left,
        top: top,
        width: p2[0] - left,
        height: p2[1] - top
    };
}
/** 根据n个点获取可以组成最大矩形的两个点 */ export function _getMaxPointByPoint() {
    for(var _len = arguments.length, pointers = new Array(_len), _key = 0; _key < _len; _key++){
        pointers[_key] = arguments[_key];
    }
    var _Math, _Math1, _Math2, _Math3;
    var allX = [];
    var allY = [];
    pointers.forEach(function(p) {
        if (p.length === 2) {
            allX.push(p[0]);
            allY.push(p[1]);
        }
    });
    // 最小和最大的四个点
    var minX = (_Math = Math).min.apply(_Math, _to_consumable_array(allX));
    var minY = (_Math1 = Math).min.apply(_Math1, _to_consumable_array(allY));
    var maxX = (_Math2 = Math).max.apply(_Math2, _to_consumable_array(allX));
    var maxY = (_Math3 = Math).max.apply(_Math3, _to_consumable_array(allY));
    return [
        [
            minX,
            minY
        ],
        [
            maxX,
            maxY
        ], 
    ];
}
/** 节点树包含这些className时应跳过事件 */ export var _tableInterruptTriggerClassName = /m78-scroll_bar|m78-table_hide-expand/;
/** 节点树包含这些类型的节点时应跳过事件 */ export var _tableInterruptTriggerTagName = /INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO/;
/** 内置事件过滤器 */ export var _tableTriggerFilters = [
    function(target) {
        if (_tableInterruptTriggerClassName.test(target.className)) return true;
        if (_tableInterruptTriggerTagName.test(target.tagName)) return true;
    }, 
];
/** 执行一组过滤器, 若该节点需要跳过则返回true, 内部会递归对target所有父级进行校验, 直到stopNode节点为止 */ export function _triggerFilterList(target, list, stopNode) {
    var cur;
    cur = target;
    while(cur !== null){
        for(var i = 0; i < list.length; i++){
            var res = list[i](target);
            if (res) return true;
        }
        var parent = cur.parentNode;
        if (!parent || parent === stopNode) {
            return false;
        }
        cur = parent;
    }
    return false;
}
/** 检测传入的事件是否是touch事件 */ export function isTouch(e) {
    return e.type.startsWith("touch") || e.pointerType === "touch";
}
