import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { getNamePathValue, getStyle, isNumber, isString, isTruthyOrZero, replaceHtmlTags, setNamePathValue } from "@m78/utils";
import { rafCaller } from "@m78/animate-tools";
import { _getSizeString } from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import clsx from "clsx";
import { addCls, removeCls, removeNode } from "../../common/index.js";
import { _TableEventPlugin } from "./event.js";
import clamp from "lodash/clamp.js";
import { _TableMetaDataPlugin } from "./meta-data.js";
/**
 * 渲染核心逻辑
 * */ export var _TableRenderPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableRenderPlugin, TablePlugin);
    var _super = _create_super(_TableRenderPlugin);
    function _TableRenderPlugin() {
        _class_call_check(this, _TableRenderPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 优化render函数 */ _define_property(_assert_this_initialized(_this), "rafCaller", void 0);
        /** 清理raf */ _define_property(_assert_this_initialized(_this), "rafClear", void 0);
        /** 用于滚动订阅优化 */ _define_property(_assert_this_initialized(_this), "event", void 0);
        _define_property(_assert_this_initialized(_this), "getter", void 0);
        return _this;
    }
    _create_class(_TableRenderPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                // 映射实现方法
                this.methodMapper(this.table, [
                    "render",
                    "renderSync",
                    "transformContentPoint",
                    "transformViewportPoint"
                ]);
            }
        },
        {
            key: "init",
            value: function init() {
                this.rafCaller = rafCaller();
                this.event = this.getPlugin(_TableEventPlugin);
                this.getter = this.getPlugin(_TableGetterPlugin);
                this.updateDom();
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                if (this.rafClear) this.rafClear();
            }
        },
        {
            /** 合并实现plugin.cellRender和config.render */ key: "cellRenderImpl",
            value: function cellRenderImpl(cell, ctx) {
                if (this.config.render) {
                    this.config.render(cell, ctx);
                    if (ctx.disableLaterRender) return;
                }
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var p = _step.value;
                        if (p.cellRender) {
                            p.cellRender(cell, ctx);
                            if (ctx.disableLaterRender) return;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        },
        {
            key: "render",
            value: function render() {
                var _this = this;
                if (this.context.takeKey) return;
                this.rafClear = this.rafCaller(function() {
                    return _this.renderMain();
                });
            }
        },
        {
            /** render的同步版本 */ key: "renderSync",
            value: function renderSync() {
                if (this.context.takeKey) {
                    this.context.takeSyncRender = true;
                    return;
                }
                this.renderMain();
            }
        },
        {
            /** render核心逻辑 */ key: "renderMain",
            value: function renderMain() {
                var _this = this;
                this.context.getterCache.tick(function() {
                    var _this_context_lastViewportItems;
                    var getter = _this.getPlugin(_TableGetterPlugin);
                    var visibleItems = getter.getViewportItems();
                    /* # # # # # # # beforeRender # # # # # # # */ _this.plugins.forEach(function(plugin) {
                        var _plugin_beforeRender;
                        (_plugin_beforeRender = plugin.beforeRender) === null || _plugin_beforeRender === void 0 ? void 0 : _plugin_beforeRender.call(plugin);
                    });
                    _this.table.event.beforeRender.emit();
                    // 清理由可见转为不可见的项
                    _this.removeHideNodes((_this_context_lastViewportItems = _this.context.lastViewportItems) === null || _this_context_lastViewportItems === void 0 ? void 0 : _this_context_lastViewportItems.cells, visibleItems.cells);
                    _this.context.lastMountRows = {};
                    _this.context.lastMountColumns = {};
                    // 在render中会触发一些列hook和事件, 这里提前循环设置值, 防止在期间读取mount状态
                    visibleItems.rows.forEach(function(row) {
                        _this.context.lastMountRows[row.key] = true;
                    });
                    visibleItems.columns.forEach(function(column) {
                        _this.context.lastMountColumns[column.key] = true;
                    });
                    // 内容渲染
                    _this.renderCell(visibleItems.cells);
                    // 事件通知
                    visibleItems.rows.forEach(function(row) {
                        _this.table.event.rowRendering.emit(row);
                    });
                    visibleItems.columns.forEach(function(column) {
                        _this.table.event.columnRendering.emit(column);
                    });
                    _this.context.lastViewportItems = visibleItems;
                    /* # # # # # # # rendering # # # # # # # */ _this.plugins.forEach(function(plugin) {
                        var _plugin_rendering;
                        (_plugin_rendering = plugin.rendering) === null || _plugin_rendering === void 0 ? void 0 : _plugin_rendering.call(plugin);
                    });
                    _this.table.event.rendering.emit();
                    /* # # # # # # # rendered # # # # # # # */ _this.plugins.forEach(function(plugin) {
                        var _plugin_rendered;
                        (_plugin_rendered = plugin.rendered) === null || _plugin_rendered === void 0 ? void 0 : _plugin_rendered.call(plugin);
                    });
                    _this.table.event.rendered.emit();
                });
            }
        },
        {
            /** 绘制单元格 */ key: "renderCell",
            value: function renderCell(cells) {
                var _this = this;
                var table = this.table;
                var x = table.getX();
                var y = table.getY();
                cells.forEach(function(cell) {
                    var row = cell.row;
                    var column = cell.column;
                    // 确保dom存在
                    _this.initCellDom(cell);
                    var dom = cell.dom;
                    // 固定项需要持续更新位置
                    if (cell.isFixed) {
                        var cellX = column.isFixed ? column.fixedOffset + x : column.x;
                        var cellY = row.isFixed ? row.fixedOffset + y : row.y;
                        dom.style.transform = "translate(".concat(cellX, "px,").concat(cellY, "px)");
                    }
                    var renderFlag = getNamePathValue(cell.state, _TableMetaDataPlugin.RENDERED_KEY);
                    var renderCtx = {
                        isFirstRender: !renderFlag,
                        disableLaterRender: false,
                        disableDefaultRender: false
                    };
                    var lastText = cell.text;
                    cell.text = _this.getter.getText(cell);
                    _this.cellRenderImpl(cell, renderCtx);
                    if (!renderFlag) {
                        setNamePathValue(cell.state, _TableMetaDataPlugin.RENDERED_KEY, true);
                    }
                    var disableDefaultRender = renderCtx.disableDefaultRender || renderCtx.disableLaterRender;
                    // 处理text, 因为.innerText读写都比较慢, 所以额外做一层判断
                    if (!disableDefaultRender) {
                        if (lastText !== cell.text) {
                            var filter = replaceHtmlTags(cell.text);
                            dom.innerHTML = "<span>".concat(filter, "</span>");
                        }
                    }
                    // 添加节点到画布
                    if (!cell.isMount) {
                        cell.isMount = true;
                        _this.context.stageEL.appendChild(dom);
                        _this.table.event.mountChange.emit(cell);
                    }
                    _this.table.event.cellRendering.emit(cell);
                });
            }
        },
        {
            /** 若不存在则初始化cell.dom, 每次reload后会在已有dom上更新 */ key: "initCellDom",
            value: function initCellDom(cell) {
                var ctx = this.context;
                if (!cell.dom) {
                    cell.dom = document.createElement("div");
                }
                var dom = cell.dom;
                var lastReloadKey = getNamePathValue(dom, _TableMetaDataPlugin.RENDERED_KEY);
                // 同一次reload中只进行一直更新
                if (lastReloadKey && lastReloadKey === ctx.lastReloadKey) {
                    return;
                }
                setNamePathValue(dom, _TableMetaDataPlugin.RENDERED_KEY, ctx.lastReloadKey);
                var column = cell.column;
                var row = cell.row;
                var mergeMapMain = ctx.mergeMapMain;
                var width = cell.column.width;
                var height = cell.row.height;
                var mergeSize = mergeMapMain[cell.key];
                // 合并处理
                if (mergeSize) {
                    if (isNumber(mergeSize.width)) width = mergeSize.width;
                    if (isNumber(mergeSize.height)) height = mergeSize.height;
                }
                var lastLeftFixed = ctx.leftFixedList[ctx.leftFixedList.length - 1];
                var lastTopFixed = ctx.topFixedList[ctx.topFixedList.length - 1];
                var isLeftLast = lastLeftFixed === column.key;
                var isTopLast = lastTopFixed === row.key;
                var leftFixedInd = ctx.leftFixedList.indexOf(column.key);
                var topFixedInd = ctx.topFixedList.indexOf(row.key);
                // 合并的项是左/上的末尾项时, 需要将其视为末尾项
                if (leftFixedInd !== -1 && cell.config.mergeX) {
                    if (leftFixedInd + mergeSize.xLength === ctx.leftFixedList.length) {
                        isLeftLast = true;
                    }
                }
                if (topFixedInd !== -1 && cell.config.mergeY) {
                    if (topFixedInd + mergeSize.yLength === ctx.topFixedList.length) {
                        isTopLast = true;
                    }
                }
                var styleObj = {
                    "__even-x": column.isEven,
                    "__even-y": row.isEven,
                    "__last-x": cell.isLastX,
                    "__last-y": cell.isLastY,
                    "__head-y": row.isHeader,
                    "__head-x": column.isHeader
                };
                if (cell.isFixed) {
                    Object.assign(styleObj, {
                        // 固定项标识
                        __fixed: true,
                        "__x-fixed": cell.column.isFixed,
                        "__y-fixed": cell.row.isFixed,
                        "__cross-fixed": cell.isCrossFixed,
                        // 边缘项标识, 通常用于去掉末尾边框
                        "__rf-first": ctx.rightFixedList[0] === column.key,
                        "__bf-first": ctx.bottomFixeList[0] === row.key,
                        "__lf-last": isLeftLast,
                        "__tf-last": isTopLast
                    });
                }
                dom.className = clsx("m78-table_cell", styleObj);
                dom.style.width = "".concat(width, "px");
                dom.style.height = "".concat(height, "px");
                if (!cell.isFixed) {
                    dom.style.transform = "translate(".concat(column.x, "px,").concat(row.y, "px)");
                }
            }
        },
        {
            /** 根据配置更新各种容器尺寸相关的内容 */ key: "updateDom",
            value: function updateDom() {
                var config = this.config;
                var ctx = this.context;
                var cH = this.config.height;
                var cW = this.config.width;
                if (isTruthyOrZero(cH)) {
                    this.table.setHeight(cH);
                }
                if (isTruthyOrZero(cW)) {
                    this.table.setWidth(cW);
                }
                this.restoreWrapSize();
                // 同步内容实际尺寸, 如果内容被缩放, 调整为缩放后的尺寸
                ctx.viewContentEl.style.height = "".concat(this.table.getContentHeight(), "px");
                ctx.viewContentEl.style.width = "".concat(this.table.getContentWidth(), "px");
                this.updateWrapSize();
                config.el.tabIndex = 0;
                // 处理stripe
                ctx.getBaseConfig("stripe") ? addCls(config.el, "__stripe") : removeCls(config.el, "__stripe");
                // 处理border
                ctx.getBaseConfig("border") ? addCls(config.el, "__border") : removeCls(config.el, "__border");
            }
        },
        {
            /** 更新容器尺寸信息 */ key: "updateWrapSize",
            value: function updateWrapSize() {
                var ctx = this.context;
                var config = this.config;
                var w = this.table.getWidth();
                var contW = this.table.getContentWidth();
                var h = this.table.getHeight();
                var contH = this.table.getContentHeight();
                // 处理autoSize
                if (config.autoSize) {
                    // 如果存在边框, 内容实际能显示的区域会被压缩, 需要额外添加边框尺寸
                    var size = this.getBorderSize();
                    if (contW < w) {
                        if (!ctx.restoreWidth) {
                            ctx.restoreWidth = config.el.style.width;
                        }
                        config.el.style.width = "".concat(contW + size.width, "px");
                    }
                    if (contH < h) {
                        if (!ctx.restoreHeight) {
                            ctx.restoreHeight = config.el.style.height;
                        }
                        config.el.style.height = "".concat(contH + size.height, "px");
                    }
                }
                // 非固定区域最小值
                var minViewSize = 200;
                // 防止容器小于固定项的尺寸
                var minWidth = Math.min(ctx.leftFixedWidth + ctx.rightFixedWidth + minViewSize, contW);
                var minHeight = Math.min(ctx.topFixedHeight + ctx.bottomFixedHeight + minViewSize, contH);
                config.el.style.minWidth = "".concat(minWidth, "px");
                config.el.style.minHeight = "".concat(minHeight, "px");
            }
        },
        {
            /** 若包含restoreWidth/restoreHeight, 则在恢复时将容器尺寸视情况恢复 */ key: "restoreWrapSize",
            value: function restoreWrapSize() {
                var config = this.config;
                var context = this.context;
                if (context.restoreWidth) {
                    // 恢复尺寸
                    config.el.style.width = config.width !== undefined ? _getSizeString(config.width) : context.restoreWidth;
                    context.restoreWidth = undefined;
                }
                if (context.restoreHeight) {
                    // 恢复尺寸
                    config.el.style.height = config.height !== undefined ? _getSizeString(config.height) : context.restoreHeight;
                    context.restoreHeight = undefined;
                }
            }
        },
        {
            /** 获取1和2的差异, 并从视口清除2中已不存在的项 */ key: "removeHideNodes",
            value: function removeHideNodes(items1, items2) {
                var _this = this;
                var existMap = {};
                // 销毁由可见变为不可见的节点
                if (items1 && items2) {
                    items2.forEach(function(item) {
                        existMap[item.key] = true;
                    });
                    items1.forEach(function(item) {
                        if (!existMap[item.key]) {
                            item.isMount = false;
                            _this.table.event.mountChange.emit(item);
                            removeNode(item.dom);
                        }
                    });
                }
            }
        },
        {
            key: "transformViewportPoint",
            value: function transformViewportPoint(param) {
                var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1], fixedOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
                var ctx = this.context;
                var lStart = 0;
                var lEnd = lStart + ctx.leftFixedWidth + fixedOffset;
                var tStart = 0;
                var tEnd = tStart + ctx.topFixedHeight + fixedOffset;
                var bEnd = this.table.getHeight();
                var bStart = bEnd - ctx.bottomFixedHeight - fixedOffset;
                var rEnd = this.table.getWidth();
                var rStart = rEnd - ctx.rightFixedWidth - fixedOffset;
                var isFixedLeft = x >= lStart && x <= lEnd;
                var isFixedTop = y >= tStart && y <= tEnd;
                var isFixedBottom = y >= bStart && y <= bEnd;
                var isFixedRight = x >= rStart && x <= rEnd;
                var realX = x + this.table.getX();
                var realY = y + this.table.getY();
                if (isFixedLeft) {
                    realX = x;
                }
                if (isFixedRight) {
                    var diffW = rEnd - x;
                    realX = this.table.getContentWidth() - diffW;
                }
                if (isFixedTop) {
                    realY = y;
                }
                if (isFixedBottom) {
                    var diffH = bEnd - y;
                    realY = this.table.getContentHeight() - diffH;
                }
                return {
                    leftFixed: isFixedLeft,
                    topFixed: isFixedTop,
                    rightFixed: isFixedRight,
                    bottomFixed: isFixedBottom,
                    x: realX,
                    y: realY,
                    xy: [
                        realX,
                        realY
                    ],
                    originY: y,
                    originX: x
                };
            }
        },
        {
            key: "transformContentPoint",
            value: function transformContentPoint(pos) {
                var contW = this.table.getContentWidth();
                var contH = this.table.getContentHeight();
                // 基础位置, 限制在可用区域内
                var x = clamp(pos[0], 0, contW);
                var y = clamp(pos[1], 0, contH);
                var lStart = 0;
                var lEnd = this.context.leftFixedWidth;
                var tStart = 0;
                var tEnd = this.context.topFixedHeight;
                var rStart = contW - this.context.rightFixedWidth;
                var rEnd = contW;
                var bStart = contH - this.context.bottomFixedHeight;
                var bEnd = contH;
                var isFixedLeft = x >= lStart && x <= lEnd;
                var isFixedTop = y >= tStart && y <= tEnd;
                var isFixedRight = x >= rStart && x <= rEnd;
                var isFixedBottom = y >= bStart && y <= bEnd;
                var realX = x - this.table.getX();
                var realY = y - this.table.getY();
                if (isFixedLeft) {
                    realX = x;
                }
                if (isFixedRight) {
                    var diffW = rEnd - x;
                    realX = this.table.getWidth() - diffW;
                }
                if (isFixedTop) {
                    realY = y;
                }
                if (isFixedBottom) {
                    var diffH = bEnd - y;
                    realY = this.table.getHeight() - diffH;
                }
                return {
                    leftFixed: isFixedLeft,
                    topFixed: isFixedTop,
                    rightFixed: isFixedRight,
                    bottomFixed: isFixedBottom,
                    x: realX,
                    y: realY,
                    xy: [
                        realX,
                        realY
                    ],
                    originY: pos[1],
                    originX: pos[0]
                };
            }
        },
        {
            key: "getBorderSize",
            value: // 获取config.el的边框尺寸
            function getBorderSize() {
                var sty = getStyle(this.config.el);
                var t = isString(sty.borderTopWidth) ? Number(sty.borderTopWidth.replace("px", "")) : 0;
                var r = isString(sty.borderRightWidth) ? Number(sty.borderRightWidth.replace("px", "")) : 0;
                var b = isString(sty.borderBottomWidth) ? Number(sty.borderBottomWidth.replace("px", "")) : 0;
                var l = isString(sty.borderLeftWidth) ? Number(sty.borderLeftWidth.replace("px", "")) : 0;
                return {
                    width: l + r,
                    height: t + b
                };
            }
        }
    ]);
    return _TableRenderPlugin;
}(TablePlugin);
