import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { deleteNamePathValue, getNamePathValue, setNamePathValue } from "@m78/utils";
import { _TablePrivateProperty, TableColumnFixed } from "../types/base-type.js";
import { TableReloadLevel } from "./life.js";
import { removeNode } from "../../common/index.js";
import { _TableGetterPlugin } from "./getter.js";
import { _syncListNode } from "../common.js";
// vb改为统一实例, 在context存储
/** 表格列隐藏 */ export var _TableHidePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableHidePlugin, TablePlugin);
    var _super = _create_super(_TableHidePlugin);
    function _TableHidePlugin() {
        _class_call_check(this, _TableHidePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 前一次处理中设置的隐藏标记的列, 需要在新的设置中先还原 */ _this.prevHideColumns = [];
        /** 展开隐藏列的节点 */ _this.expandNodes = [];
        _this.handleClick = function(e) {
            if (!_this.expandNodes.length) return;
            var target = e.target;
            if (!_this.expandNodes.includes(target)) return;
            var key = target.dataset.key;
            if (!key) return;
            _this.showColumn(key);
        };
        return _this;
    }
    var _proto = _TableHidePlugin.prototype;
    _proto.initialized = function initialized() {
        this.getter = this.getPlugin(_TableGetterPlugin);
        this.wrapNodes = document.createElement("div");
        this.wrapNodes.className = "m78-table_hide-wrap";
        this.context.viewContentEl.appendChild(this.wrapNodes);
        this.config.el.addEventListener("click", this.handleClick);
    };
    _proto.beforeDestroy = function beforeDestroy() {
        removeNode(this.wrapNodes);
        this.config.el.removeEventListener("click", this.handleClick);
    };
    _proto.rendering = function rendering() {
        this.renderNodes();
    };
    _proto.loadStage = function loadStage(level, isBefore) {
        if (level === TableReloadLevel.index && isBefore) {
            this.handle();
        }
    };
    // 隐藏处理, 为隐藏列设置ignore标记
    _proto.handle = function handle() {
        var _this = this;
        var ctx = this.context;
        var hideColumns = this.context.persistenceConfig.hideColumns || [];
        this.prevHideColumns.forEach(function(cur) {
            deleteNamePathValue(cur, _TablePrivateProperty.ignore);
            deleteNamePathValue(cur, _TablePrivateProperty.hide);
        });
        this.prevHideColumns = [];
        hideColumns.forEach(function(key) {
            var list = ctx.columns.filter(function(col) {
                return col.key === key;
            });
            if (!list.length) return;
            var cur = list[0];
            // 包含多项说明是固定项, 仅需要对虚拟项进行操作
            if (list.length > 1) {
                cur = list.find(function(i) {
                    return getNamePathValue(i, _TablePrivateProperty.fake);
                });
            }
            if (!cur) return;
            setNamePathValue(cur, _TablePrivateProperty.ignore, true);
            setNamePathValue(cur, _TablePrivateProperty.hide, true);
            _this.prevHideColumns.push(cur);
        });
    };
    /** 是否为隐藏列 */ _proto.isHideColumn = function isHideColumn(key) {
        var hideColumns = this.context.persistenceConfig.hideColumns || [];
        return hideColumns.indexOf(key) !== -1;
    };
    /** 渲染标记 */ _proto.renderNodes = function renderNodes() {
        var _this = this;
        var hideColumns = this.context.persistenceConfig.hideColumns || [];
        _syncListNode({
            wrapNode: this.wrapNodes,
            list: hideColumns,
            nodeList: this.expandNodes,
            createAction: function(node) {
                node.className = "m78-table_hide-expand __default";
                node.innerHTML = "⬌";
            }
        });
        if (!hideColumns.length) return;
        var lastRowKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
        if (!lastRowKey) return;
        var lastRow = this.getter.getRow(lastRowKey);
        if (!lastRow) return;
        hideColumns.forEach(function(key, index) {
            var column = _this.getter.getColumn(key);
            var curNode = _this.expandNodes[index];
            var width = curNode.offsetWidth;
            curNode.dataset.key = String(key);
            var attachPos = _this.table.getColumnAttachPosition(column);
            var left = attachPos.left - width / 2 - 1; // width / 2: 居中  1: 为边框的修正位置
            // 右固定项需要右移
            if (column.config.fixed === TableColumnFixed.right) {
                left += 2;
            }
            curNode.title = "show hide column ".concat(column.config.label || column.key);
            curNode.style.zIndex = column.isFixed ? attachPos.zIndex : "11";
            curNode.style.transform = "translate(".concat(left, "px,").concat(lastRow.y + _this.table.getY() + 2, "px)"); // 2: 上边距
        });
    };
    _proto.showColumn = function showColumn(key) {
        var hideColumns = this.context.persistenceConfig.hideColumns || [];
        var newList = hideColumns.filter(function(k) {
            return k !== key;
        });
        this.table.setPersistenceConfig("hideColumns", newList, "show column");
    };
    return _TableHidePlugin;
}(TablePlugin);
