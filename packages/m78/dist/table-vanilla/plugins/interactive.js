import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { createKeyboardHelpersBatch, isFunction, isPromiseLike, isTruthyOrZero, setCacheValue, setNamePathValue } from "@m78/utils";
import { removeNode } from "../../common/index.js";
import { _TableFormPlugin } from "./form/form.js";
import { _TableDisablePlugin } from "./disable.js";
/**
 * 提供单元格双击交互功能, 用于实现交互期间展示表单控件或其他交互组件, 是在form的上做的一层抽象, 并非一定用于form
 * */ export var _TableInteractivePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableInteractivePlugin, TablePlugin);
    var _super = _create_super(_TableInteractivePlugin);
    function _TableInteractivePlugin() {
        _class_call_check(this, _TableInteractivePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        // 所有活动的交互项
        _define_property(_assert_this_initialized(_this), "items", []);
        // 包裹所有创建节点的容器
        _define_property(_assert_this_initialized(_this), "wrapNode", void 0);
        // 实现双击
        _define_property(_assert_this_initialized(_this), "doubleClickLastCell", null);
        _define_property(_assert_this_initialized(_this), "doubleClickTimer", null);
        // 最后触发交互关闭的时间, 用于防止关闭后马上出发Enter等操作
        _define_property(_assert_this_initialized(_this), "lastDownTime", 0);
        // 最后触发交互开启的时间, 用于防止启动交互后因为不可见等导致马上别关闭
        _define_property(_assert_this_initialized(_this), "lastInteractiveTime", 0);
        _define_property(_assert_this_initialized(_this), "multipleHelper", void 0);
        _define_property(_assert_this_initialized(_this), "form", void 0);
        _define_property(_assert_this_initialized(_this), "disable", void 0);
        _define_property(_assert_this_initialized(_this), "onAttachClick", function(e) {
            e.stopPropagation();
        });
        _define_property(_assert_this_initialized(_this), "onClick", function(cell) {
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
        });
        /** 使一个单元格进入交互状态, 可通过defaultValue设置交互后的起始默认值, 默认为当前单元格value */ _define_property(_assert_this_initialized(_this), "interactive", function(cell, defaultValue) {
            if (!_this.isInteractive(cell)) return;
            if (!_this.form.validCheck(cell)) return;
            _this.lastInteractiveTime = Date.now();
            var attachNode = _this.createAttachNode();
            // eslint-disable-next-line prefer-const
            var done;
            var itemDone = function() {
                var isConfirm = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
                _this.lastDownTime = Date.now();
                if (item.unmounted) return;
                item.unmounted = true;
                var ret = done(isConfirm);
                var clear = function() {
                    var ind = _this.items.indexOf(item);
                    if (ind !== -1) {
                        _this.items.splice(ind, 1);
                    }
                    _this.table.event.interactiveChange.emit(cell, false, isConfirm);
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
            _this.table.selectCells(cell.key);
            _this.table.locate(cell.key, true); // 如果前一个interactive是提交, 可能触发验证错误, 会自动定位单元格, 这里传入true来抢占跳转权
            _this.updateNode();
            _this.table.event.interactiveChange.emit(cell, true, false);
        });
        _define_property(_assert_this_initialized(_this), "onTabDown", function() {
            var last = _this.items[_this.items.length - 1];
            if (!last) return;
            var next = _this.table.getNearCell({
                cell: last.cell,
                filter: function(cell) {
                    if (cell.column.isHeader || cell.row.isHeader) return false;
                    if (!_this.isInteractive(cell)) return false;
                    if (!_this.form.validCheck(cell)) return false;
                    // ignore idea tips.
                    return true;
                }
            });
            if (next) {
                _this.interactive(next);
            }
        });
        _define_property(_assert_this_initialized(_this), "onEnterDown", function() {
            var cell = _this.table.getSelectedCells();
            if (cell.length === 1 && !_this.isJustDoneExecuted()) {
                _this.interactive(cell[0]);
                return;
            }
            return false;
        });
        _define_property(_assert_this_initialized(_this), "onEscDown", function() {
            _this.items.forEach(function(item) {
                item.done(false);
            });
        });
        return _this;
    }
    _create_class(_TableInteractivePlugin, [
        {
            key: "init",
            value: function init() {
                this.form = this.getPlugin(_TableFormPlugin);
                this.disable = this.getPlugin(_TableDisablePlugin);
                this.initDom();
            }
        },
        {
            key: "mounted",
            value: function mounted() {
                this.table.event.click.on(this.onClick);
                this.multipleHelper = createKeyboardHelpersBatch(this.getKeydownOptions());
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.table.event.click.off(this.onClick);
                this.multipleHelper.destroy();
                setNamePathValue(this, "multipleHelper", null);
                this.wrapNode.removeEventListener("click", this.onAttachClick);
                this.doubleClickTimer && clearTimeout(this.doubleClickTimer);
                removeNode(this.wrapNode);
            }
        },
        {
            key: "rendering",
            value: function rendering() {
                this.updateNode();
            }
        },
        {
            key: "rendered",
            value: function rendered() {
                this.hideInvisibleInteractive();
            }
        },
        {
            key: "getKeydownOptions",
            value: // 事件绑定配置
            function getKeydownOptions() {
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
                            "Enter"
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
                    }
                ];
            }
        },
        {
            key: "initDom",
            value: // 初始化必须的node
            function initDom() {
                this.wrapNode = document.createElement("div");
                this.wrapNode.className = "m78-table_edit";
                this.wrapNode.addEventListener("click", this.onAttachClick);
                this.context.viewContentEl.appendChild(this.wrapNode);
            }
        },
        {
            // 检测单元格能否进行交互
            key: "isInteractive",
            value: function isInteractive(cell) {
                if (cell.row.isHeader || cell.column.isHeader) return false;
                if (!this.config.interactive) return false;
                if (isFunction(this.config.interactive) && !this.config.interactive(cell)) return false;
                // 禁用项阻止交互
                if (this.disable && this.disable.isDisabledCell(cell.key)) return false;
                return isFunction(this.config.interactiveRender);
            }
        },
        {
            key: "updateNode",
            value: // 更新当前节点位置/尺寸
            function updateNode() {
                var _this = this;
                if (!this.items.length) return;
                this.items.forEach(function(item) {
                    // 只有固定项需要持续更新位置
                    if (item.mounted && !item.cell.isFixed) return;
                    var cell = item.cell, node = item.node;
                    var attachPos = _this.table.getAttachPosition(cell);
                    setCacheValue(node.style, "width", "".concat(attachPos.width - 1, "px"));
                    setCacheValue(node.style, "height", "".concat(attachPos.height - 1, "px"));
                    setCacheValue(node.style, "transform", "translate(".concat(attachPos.left, "px,").concat(attachPos.top, "px)"));
                    setCacheValue(node.style, "zIndex", String(Number(attachPos.zIndex) + 2)); // 高于错误反馈等提示节点
                    item.mounted = true;
                });
            }
        },
        {
            key: "hideInvisibleInteractive",
            value: // 隐藏不可见的正在交互单元格, 并触发其提交
            function hideInvisibleInteractive() {
                if (!this.items.length || this.isJustTriggered()) return;
                this.items.forEach(function(i) {
                    if (!i.cell.isMount) {
                        i.done(true);
                    }
                });
            }
        },
        {
            key: "closeAll",
            value: function closeAll() {
                // 关闭现有交互项
                this.items.forEach(function(i) {
                    if (i.unmounted) return;
                    i.done();
                });
            }
        },
        {
            key: "createAttachNode",
            value: // 创建一个attachNode
            function createAttachNode() {
                var el = document.createElement("div");
                el.className = "m78-table_edit-attach";
                this.wrapNode.appendChild(el);
                return el;
            }
        },
        {
            key: "isJustDoneExecuted",
            value: // 最近是否执行过done
            function isJustDoneExecuted() {
                return Date.now() - this.lastDownTime < 180;
            }
        },
        {
            key: "isJustTriggered",
            value: // 最近是否触发过交互
            function isJustTriggered() {
                return Date.now() - this.lastInteractiveTime < 80;
            }
        }
    ]);
    return _TableInteractivePlugin;
}(TablePlugin);
