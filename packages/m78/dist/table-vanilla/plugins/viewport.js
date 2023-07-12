import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { getNamePathValue, isNumber, isTruthyOrZero, rafCaller, setNamePathValue } from "@m78/utils";
import { _getSizeString } from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import clsx from "clsx";
import { removeNode, addCls, removeCls } from "../../common/index.js";
import { _TablePrivateProperty } from "../types/base-type.js";
import { _TableEventPlugin } from "./event.js";
/**
 * 视口/尺寸/滚动相关的核心功能实现
 * */ export var _TableViewportPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableViewportPlugin, TablePlugin);
    var _super = _create_super(_TableViewportPlugin);
    function _TableViewportPlugin() {
        _class_call_check(this, _TableViewportPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _this.isColumnVisible = function(key) {
            var partial = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
            return _this.visibleCommon(false, key, partial);
        };
        _this.isRowVisible = function(key) {
            var partial = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
            return _this.visibleCommon(true, key, partial);
        };
        _this.isCellVisible = function(rowKey, columnKey) {
            var partial = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            var cell = _this.table.getCell(rowKey, columnKey);
            if (partial) {
                return cell.isMount;
            }
            return _this.isRowVisible(rowKey, partial) && _this.isColumnVisible(columnKey, partial);
        };
        return _this;
    }
    var _proto = _TableViewportPlugin.prototype;
    _proto.init = function init() {
        // 映射实现方法
        this.methodMapper(this.table, [
            "width",
            "height",
            "contentWidth",
            "contentHeight",
            "x",
            "y",
            "xy",
            "maxX",
            "maxY",
            "render",
            "renderSync",
            "isRowVisible",
            "isColumnVisible",
            "isCellVisible", 
        ]);
        this.rafCaller = rafCaller();
        this.event = this.getPlugin(_TableEventPlugin);
        this.updateDom();
    };
    _proto.beforeDestroy = function beforeDestroy() {
        if (this.rafClear) this.rafClear();
    };
    /** 合并实现plugin.cellRender和config.render */ _proto.cellRenderImpl = function cellRenderImpl(cell, ctx) {
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
    };
    _proto.width = function width(width1) {
        var el = this.config.el;
        if (width1 === undefined) return el.offsetWidth;
        el.style.width = _getSizeString(width1);
        this.render();
    };
    _proto.height = function height(height1) {
        var el = this.config.el;
        if (height1 === undefined) return el.offsetHeight;
        el.style.height = _getSizeString(height1);
        this.render();
    };
    _proto.contentWidth = function contentWidth() {
        if (this.config.autoSize) {
            return this.context.contentWidth;
        } else {
            // 无自动尺寸时, 内容尺寸不小于容器尺寸, 否则xy()等计算会出现问题
            return Math.max(this.context.contentWidth, this.table.width());
        }
    };
    _proto.contentHeight = function contentHeight() {
        if (this.config.autoSize) {
            return this.context.contentHeight;
        } else {
            // 见contentWidth()
            return Math.max(this.context.contentHeight, this.table.height());
        }
    };
    _proto.x = function x(x1) {
        var _this = this;
        var ctx = this.context;
        var viewEl = ctx.viewEl;
        if (x1 === undefined) return viewEl.scrollLeft;
        var run = function() {
            viewEl.scrollLeft = x1;
            _this.render();
        };
        // 阻断/不阻断内部onScroll事件
        if (!ctx.xyShouldNotify) {
            this.event.scrollAction(run);
        } else {
            run();
        }
    };
    _proto.y = function y(y1) {
        var _this = this;
        var ctx = this.context;
        var viewEl = ctx.viewEl;
        if (y1 === undefined) return viewEl.scrollTop;
        var run = function() {
            viewEl.scrollTop = y1;
            _this.render();
        };
        // 阻断/不阻断内部onScroll事件
        if (!ctx.xyShouldNotify) {
            this.event.scrollAction(run);
        } else {
            run();
        }
    };
    _proto.xy = function xy(x, y) {
        var _this = this;
        var ctx = this.context;
        var viewEl = ctx.viewEl;
        if (x === undefined || y === undefined) {
            return [
                viewEl.scrollLeft,
                viewEl.scrollTop
            ];
        }
        this.table.takeover(function() {
            _this.x(x);
            _this.y(y);
        });
    };
    _proto.maxX = function maxX() {
        return this.context.viewEl.scrollWidth - this.context.viewEl.clientWidth;
    };
    _proto.maxY = function maxY() {
        return this.context.viewEl.scrollHeight - this.context.viewEl.clientHeight;
    };
    _proto.render = function render() {
        var _this = this;
        if (this.context.takeKey) return;
        this.rafClear = this.rafCaller(function() {
            return _this.renderMain();
        });
    };
    /** render的同步版本 */ _proto.renderSync = function renderSync() {
        if (this.context.takeKey) {
            this.context.takeSyncRender = true;
            return;
        }
        this.renderMain();
    };
    /** render核心逻辑 */ _proto.renderMain = function renderMain() {
        var ref;
        var getter = this.getPlugin(_TableGetterPlugin);
        var visibleItems = getter.getViewportItems();
        // 清理由可见转为不可见的项
        this.removeHideNodes((ref = this.context.lastViewportItems) === null || ref === void 0 ? void 0 : ref.cells, visibleItems.cells);
        // 内容渲染
        this.renderCell(visibleItems.cells);
        this.context.lastViewportItems = visibleItems;
        /* # # # # # # # rendering # # # # # # # */ this.plugins.forEach(function(plugin) {
            var ref;
            (ref = plugin.rendering) === null || ref === void 0 ? void 0 : ref.call(plugin);
        });
        /* # # # # # # # rendered # # # # # # # */ this.plugins.forEach(function(plugin) {
            var ref;
            (ref = plugin.rendered) === null || ref === void 0 ? void 0 : ref.call(plugin);
        });
    };
    /** 绘制单元格 */ _proto.renderCell = function renderCell(cells) {
        var _this = this;
        var table = this.table;
        var x = table.x();
        var y = table.y();
        cells.forEach(function(cell) {
            var row = cell.row;
            var column = cell.column;
            var lastText = cell.text;
            var _text = row.data[column.key];
            cell.text = isTruthyOrZero(_text) ? String(_text) : "";
            // 确保dom存在
            _this.initCellDom(cell);
            var dom = cell.dom;
            // 固定项需要持续更新位置
            if (cell.isFixed) {
                var cellX = column.isFixed ? column.fixedOffset + x : column.x;
                var cellY = row.isFixed ? row.fixedOffset + y : row.y;
                dom.style.top = "".concat(cellY, "px");
                dom.style.left = "".concat(cellX, "px");
            }
            var renderFlag = getNamePathValue(cell.state, _TablePrivateProperty.renderFlag);
            var renderCtx = {
                isFirstRender: !renderFlag,
                disableLaterRender: false,
                disableDefaultRender: false
            };
            _this.cellRenderImpl(cell, renderCtx);
            if (!renderFlag) {
                setNamePathValue(cell.state, _TablePrivateProperty.renderFlag, true);
            }
            var disableDefaultRender = renderCtx.disableDefaultRender || renderCtx.disableLaterRender;
            // 处理text, 因为.innerText读写都比较慢, 所以额外做一层判断
            if (!disableDefaultRender && lastText !== cell.text) {
                dom.innerText = cell.text;
            }
            // 添加节点
            if (!cell.isMount) {
                cell.isMount = true;
                _this.context.stageEL.appendChild(dom);
            }
        });
    };
    /** 若不存在则初始化cell.dom, 每次reload后会在已有dom上更新 */ _proto.initCellDom = function initCellDom(cell) {
        var ctx = this.context;
        if (!ctx.cellDomCaChe[cell.key]) {
            ctx.cellDomCaChe[cell.key] = document.createElement("div");
        }
        var dom = ctx.cellDomCaChe[cell.key];
        var lastReloadKey = getNamePathValue(dom, _TablePrivateProperty.reloadKey);
        // 同一次reload中跳过后续操作
        if (lastReloadKey && lastReloadKey === ctx.lastReloadKey) {
            return;
        }
        setNamePathValue(dom, _TablePrivateProperty.reloadKey, ctx.lastReloadKey);
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
                "__cross-fixed": cell.isCrossFixed,
                // 边缘项标识, 通常用于去掉末尾边框
                "__rf-first": ctx.rightFixedList[0] === column.key || ctx.rightFixedListAll[0] === column.key,
                "__bf-first": ctx.bottomFixeList[0] === row.key,
                "__lf-last": isLeftLast,
                "__tf-last": isTopLast
            });
        }
        dom.className = clsx("m78-table_cell", styleObj);
        dom.style.width = "".concat(width, "px");
        dom.style.height = "".concat(height, "px");
        if (!cell.isFixed) {
            dom.style.left = "".concat(column.x, "px");
            dom.style.top = "".concat(row.y, "px");
        }
        cell.dom = dom;
    };
    /** 根据配置更新各种容器尺寸相关的内容 */ _proto.updateDom = function updateDom() {
        var config = this.config;
        var ctx = this.context;
        var cH = this.config.height;
        var cW = this.config.width;
        if (isTruthyOrZero(cH)) {
            this.height(cH);
        }
        if (isTruthyOrZero(cW)) {
            this.width(cW);
        }
        this.restoreWrapSize();
        // 同步内容实际尺寸, 如果内容被缩放, 调整为缩放后的尺寸
        ctx.viewContentEl.style.height = "".concat(this.table.contentHeight(), "px");
        ctx.viewContentEl.style.width = "".concat(this.table.contentWidth(), "px");
        // 处理autoSize
        var w = this.table.width();
        var contW = this.table.contentWidth();
        var h = this.table.height();
        var contH = this.table.contentHeight();
        if (config.autoSize) {
            if (contW < w) {
                ctx.restoreWidth = config.el.style.width;
                config.el.style.width = "".concat(contW, "px");
            }
            if (contH < h) {
                ctx.restoreHeight = config.el.style.height;
                config.el.style.height = "".concat(contH, "px");
            }
        }
        var baseSize = 200;
        // 防止容器小于固定项的尺寸
        var minWidth = Math.min(ctx.leftFixedWidth + ctx.rightFixedWidth + baseSize, contW);
        var minHeight = Math.min(ctx.topFixedHeight + ctx.bottomFixedHeight + baseSize, contH);
        config.el.style.minWidth = "".concat(minWidth, "px");
        config.el.style.minHeight = "".concat(minHeight, "px");
        // 处理stripe
        config.stripe ? addCls(config.el, "__stripe") : removeCls(config.el, "__stripe");
    };
    /** 若包含restoreWidth/restoreHeight, 则在恢复时将容器尺寸视情况恢复 */ _proto.restoreWrapSize = function restoreWrapSize() {
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
    };
    /** 获取1和2的差异, 并从视口清除2中已不存在的项 */ _proto.removeHideNodes = function removeHideNodes(items1, items2) {
        var existMap = {};
        // 销毁由可见变为不可见的节点
        if (items1 && items2) {
            items2.forEach(function(item) {
                existMap[item.key] = true;
            });
            items1.forEach(function(item) {
                if (!existMap[item.key]) {
                    removeNode(item.dom);
                    item.isMount = false;
                }
            });
        }
    };
    /** isColumnVisible/isRowVisible通用逻辑 */ _proto.visibleCommon = function visibleCommon(isRow, key, partial) {
        var ctx = this.context;
        var current = isRow ? this.table.getRow(key) : this.table.getColumn(key);
        if (current.isFixed) return true;
        var rowCur = current;
        var colCur = current;
        var size = isRow ? rowCur.height : colCur.width;
        var contStart = isRow ? rowCur.y : colCur.x;
        var contEnd = contStart + size;
        var pos = isRow ? this.table.y() : this.table.x();
        var tableSize = isRow ? this.table.height() : this.table.width();
        var startFixedSize = isRow ? ctx.topFixedHeight : ctx.leftFixedWidth;
        var endFixedSize = isRow ? ctx.bottomFixedHeight : ctx.rightFixedWidth;
        // 开始/结束边界
        var startLine = pos + startFixedSize;
        var endLine = pos + tableSize - endFixedSize;
        var isVisible = false;
        if (partial) {
            isVisible = contEnd >= startLine && contStart <= endLine;
        } else {
            isVisible = contStart >= startLine && contEnd <= endLine;
        }
        return isVisible;
    };
    return _TableViewportPlugin;
}(TablePlugin);
