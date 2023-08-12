import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { createKeyboardHelpersBatch, isFunction, isPromiseLike, isTruthyOrZero, setNamePathValue } from "@m78/utils";
import { removeNode } from "../../common/index.js";
import { _TableFormPlugin } from "./form.js";
/**
 * 提供最基础的单元格双击交互功能, 通常用于搭配form插件实现单元格编辑和验证
 *
 * interactive 并非一定表示单元格编辑, 也可以纯展示的其他交互组件
 * */ export var _TableInteractiveCorePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableInteractiveCorePlugin, TablePlugin);
    var _super = _create_super(_TableInteractiveCorePlugin);
    function _TableInteractiveCorePlugin() {
        _class_call_check(this, _TableInteractiveCorePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        // 所有活动的交互项
        _this.items = [];
        // 实现双击
        _this.doubleClickLastCell = null;
        _this.doubleClickTimer = null;
        // 最后触发交互关闭的时间, 用于防止关闭后马上出发Enter等操作
        _this.lastDownTime = 0;
        _this.onAttachClick = function(e) {
            e.stopPropagation();
        };
        _this.onClick = function(cell) {
            if (_this.doubleClickLastCell === cell) {
                _this.doubleClickLastCell = null;
                _this.doubleClickTimer && clearTimeout(_this.doubleClickTimer);
                _this.interactive(cell);
                return;
            }
            _this.closeAll();
            _this.doubleClickTimer && clearTimeout(_this.doubleClickTimer);
            _this.doubleClickLastCell = cell;
            _this.doubleClickTimer = setTimeout(function() {
                _this.doubleClickLastCell = null;
            }, 800);
        };
        /** 使一个单元格进入交互状态, 可通过defaultValue设置交互后的起始默认值, 默认为当前单元格value */ _this.interactive = function(cell, defaultValue) {
            if (!_this.isInteractive(cell)) return;
            if (!_this.form.validCheck(cell)) return;
            var attachNode = _this.createAttachNode();
            // eslint-disable-next-line prefer-const
            var done;
            var itemDone = function() {
                var isSubmit = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                _this.lastDownTime = Date.now();
                if (item.unmounted) return;
                item.unmounted = true;
                var ret = done(isSubmit);
                var clear = function() {
                    var ind = _this.items.indexOf(item);
                    if (ind !== -1) {
                        _this.items.splice(ind, 1);
                    }
                    _this.table.event.interactiveChange.emit(cell, false, isSubmit);
                    removeNode(attachNode);
                };
                if (isPromiseLike(ret)) {
                    ret.finally(clear);
                } else {
                    clear();
                }
            };
            var item = {
                cell: cell,
                node: attachNode,
                done: itemDone
            };
            _this.closeAll();
            done = _this.config.interactiveRender(_object_spread_props(_object_spread({}, item), {
                value: isTruthyOrZero(defaultValue) ? defaultValue : _this.table.getValue(cell)
            }));
            _this.items.push(item);
            _this.table.selectCells([
                cell.key
            ]);
            _this.table.locate(cell.key);
            _this.updateNode();
            _this.table.event.interactiveChange.emit(cell, true, false);
        };
        _this.onTabDown = function() {
            var last = _this.items[_this.items.length - 1];
            if (!last) return;
            var next = _this.table.getNearCell({
                cell: last.cell,
                filter: function(cell) {
                    if (cell.column.isHeader || cell.row.isHeader) return false;
                    if (!_this.isInteractive(cell)) return false;
                    if (!_this.form.validCheck(cell)) return false;
                    return true;
                }
            });
            if (next) {
                _this.interactive(next);
            }
        };
        _this.onEnterDown = function() {
            var cell = _this.table.getSelectedCells();
            if (cell.length === 1 && !_this.isJustDoneExecuted()) {
                _this.interactive(cell[0]);
                return;
            }
            return false;
        };
        _this.onEscDown = function() {
            _this.items.forEach(function(item) {
                item.done(false);
            });
        };
        return _this;
    }
    var _proto = _TableInteractiveCorePlugin.prototype;
    _proto.mounted = function mounted() {
        this.initDom();
        this.table.event.click.on(this.onClick);
        this.multipleHelper = createKeyboardHelpersBatch(this.getKeydownOptions());
        this.form = this.getPlugin(_TableFormPlugin);
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.table.event.click.off(this.onClick);
        this.multipleHelper.destroy();
        setNamePathValue(this, "multipleHelper", null);
        this.wrapNode.removeEventListener("click", this.onAttachClick);
        this.doubleClickTimer && clearTimeout(this.doubleClickTimer);
        removeNode(this.wrapNode);
    };
    _proto.rendering = function rendering() {
        this.updateNode();
    };
    // 事件绑定配置
    _proto.getKeydownOptions = function getKeydownOptions() {
        var _this = this;
        var hasItemChecker = function() {
            return _this.table.isActive() && !!_this.items.length;
        };
        var hasNotItemChecker = function() {
            return _this.table.isActive() && !_this.items.length;
        };
        return [
            {
                code: "Tab",
                handle: this.onTabDown,
                enable: hasItemChecker
            },
            {
                code: "Escape",
                handle: this.onEscDown,
                enable: hasItemChecker
            },
            {
                code: [
                    "Enter",
                    "Space"
                ],
                handle: this.onEnterDown,
                enable: hasNotItemChecker
            },
            // 常规件输入时, 也能进入交互状态
            {
                handle: this.onEnterDown,
                enable: function(e) {
                    if (!hasNotItemChecker()) return false;
                    return /^\w$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey;
                }
            }, 
        ];
    };
    // 初始化必须的node
    _proto.initDom = function initDom() {
        this.wrapNode = document.createElement("div");
        this.wrapNode.className = "m78-table_edit";
        this.wrapNode.addEventListener("click", this.onAttachClick);
        this.context.viewContentEl.appendChild(this.wrapNode);
    };
    // 检测单元格能否进行交互
    _proto.isInteractive = function isInteractive(cell) {
        if (cell.row.isHeader || cell.column.isHeader) return false;
        if (this.config.interactive === false) return false;
        if (!this.config.interactive) return false;
        if (isFunction(this.config.interactive) && !this.config.interactive(cell)) return false;
        return isFunction(this.config.interactiveRender);
    };
    // 更新当前节点位置/尺寸
    _proto.updateNode = function updateNode() {
        var _this = this;
        if (!this.items.length) return;
        this.items.forEach(function(item) {
            // 只有固定项需要持续更新位置
            if (item.mounted && !item.cell.isFixed) return;
            var cell = item.cell, node = item.node;
            var attachPos = _this.table.getAttachPosition(cell);
            node.style.width = "".concat(attachPos.width, "px");
            node.style.height = "".concat(attachPos.height, "px");
            node.style.transform = "translate(".concat(attachPos.left, "px,").concat(attachPos.top, "px)");
            node.style.zIndex = attachPos.zIndex;
            item.mounted = true;
        });
    };
    _proto.closeAll = function closeAll() {
        // 关闭现有交互项
        this.items.forEach(function(i) {
            if (i.unmounted) return;
            i.done();
        });
    };
    // 创建一个attachNode
    _proto.createAttachNode = function createAttachNode() {
        var el = document.createElement("div");
        el.className = "m78-table_edit-attach";
        this.wrapNode.appendChild(el);
        return el;
    };
    // 最近是否执行过done
    _proto.isJustDoneExecuted = function isJustDoneExecuted() {
        return Date.now() - this.lastDownTime < 180;
    };
    return _TableInteractiveCorePlugin;
}(TablePlugin);
