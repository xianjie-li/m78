import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { isNumber } from "@m78/utils";
import { removeNode } from "../common/index.js";
export var _prefix = "m78-table";
/** 用于在config.el上存储当前实例 */ export var _privateInstanceKey = "__M78TableInstance";
/** 用于在domEl上挂载是否为其是否为内部创建的信息 */ export var _privateScrollerDomKey = "__M78PrivateScrollerDom";
/** 可替换的文本 */ export var tableDefaultTexts = {
    "paste unaligned row": "Pasted rows does not match the number of selected rows",
    "paste unaligned column": "Pasted column does not match the number of selected column",
    "paste single value limit": "Paste single value can't exceed {num} cell",
    paste: "Can not paste to non editable cell",
    "add row": "Add row",
    "remove row": "Remove row",
    "restore row": "Restore remove row",
    "soft remove tip": "The row has been removed and will take effect after submission",
    "set value": "Update value",
    "move row": "Move row",
    "move column": "Move column",
    editable: "Editable",
    "editable and required": "Editable (required)",
    "currently not editable": "Currently not editable",
    clipboardWarning: "Can't get clipboard data, bowser not support or does not have permissions.",
    selectAllOrUnSelectAll: "Select All/Cancel"
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
    var _getMaxPointByPoint_apply = _sliced_to_array(_getMaxPointByPoint.apply(void 0, _to_consumable_array(pointers)), 2), p1 = _getMaxPointByPoint_apply[0], p2 = _getMaxPointByPoint_apply[1];
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
        ]
    ];
}
/** 节点树包含这些className时应跳过事件 */ export var _tableInterruptTriggerClassName = /m78-scroll_bar/;
/** 节点树包含这些类型的节点时应跳过事件 */ export var _tableInterruptTriggerTagName = /INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO/;
/** 内置事件过滤器 */ export var _tableTriggerFilters = [
    function(target) {
        if (_tableInterruptTriggerClassName.test(target.className)) return true;
        if (_tableInterruptTriggerTagName.test(target.tagName)) return true;
    }
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
/** 用于需要根据指定list同步增加或减少dom列表的场景 */ export function _syncListNode(arg) {
    var wrapNode = arg.wrapNode, list = arg.list, nodeList = arg.nodeList, createAction = arg.createAction;
    if (list.length > nodeList.length) {
        // 节点不够则创建
        var diff = list.length - nodeList.length;
        for(var i = 0; i < diff; i++){
            var node = document.createElement("div");
            createAction === null || createAction === void 0 ? void 0 : createAction(node);
            wrapNode.appendChild(node);
            nodeList.push(node);
        }
    } else {
        var _nodeList;
        // 移除多余节点
        var redundant = nodeList.slice(list.length);
        redundant.forEach(function(node) {
            return removeNode(node);
        });
        var newNodes = nodeList.slice(0, list.length);
        nodeList.length = 0;
        (_nodeList = nodeList).push.apply(_nodeList, _to_consumable_array(newNodes));
    }
}
/** 用于便捷的根据当前 lastViewportItems 生成用于高效检测row mount状态的检测方法 */ export function _rowMountChecker() {
    var visibleRows = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    // 用于快速获取行的挂载状态
    var showMap = {};
    visibleRows.forEach(function(row) {
        showMap[row.key] = true;
    });
    return function(key) {
        return !!showMap[key];
    };
}
