import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import debounce from "lodash/debounce.js";
import { addCls, removeCls } from "../../common/index.js";
import { isFocus, isNumber, isString } from "@m78/utils";
export var _TableIsPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableIsPlugin, TablePlugin);
    var _super = _create_super(_TableIsPlugin);
    function _TableIsPlugin() {
        _class_call_check(this, _TableIsPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 内部isActive状态 */ _this._isActive = false;
        /** 可由用户控制的active状态, 和_isActive一起构成active状态  */ _this._isControllableActive = true;
        // 开始滚动时更新isActive
        _this.onActive = debounce(function() {
            if (_this._isActive) return;
            _this._isActive = true;
            addCls(_this.config.el, "__active");
        }, 200, {
            leading: true,
            trailing: false
        });
        // 点击/移入时更新isActive
        _this.onIsActiveCheck = debounce(function(e) {
            var mouseEvent = e;
            var touchEvent = e;
            var el = _this.config.el;
            var active;
            if (e.type === "mouseenter") {
                active = true;
            } else {
                var x;
                var y;
                if (e.type === "mousedown") {
                    x = mouseEvent.clientX;
                    y = mouseEvent.clientY;
                } else {
                    x = touchEvent.touches[0].clientX;
                    y = touchEvent.touches[0].clientY;
                }
                var rect = el.getBoundingClientRect();
                active = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
            }
            if (active === _this._isActive) return;
            _this._isActive = active;
            if (_this._isActive) {
                addCls(el, "__active");
            } else {
                removeCls(el, "__active");
            }
        }, 200, {
            leading: true,
            trailing: true
        });
        _this.onWindowBlur = function() {
            if (!_this._isActive) return;
            _this._isActive = false;
            removeCls(_this.config.el, "__active");
        };
        return _this;
    }
    var _proto = _TableIsPlugin.prototype;
    _proto.beforeInit = function beforeInit() {
        this.methodMapper(this.table, [
            "isRowVisible",
            "isColumnVisible",
            "isCellVisible",
            "isFocus",
            "isActive",
            "isRowExist",
            "isColumnExist",
            "isColumnExistByIndex",
            "isRowExistByIndex",
            "isRowLike",
            "isColumnLike",
            "isCellLike",
            "isTableKey", 
        ]);
    };
    _proto.mounted = function mounted() {
        this.activeEventBind();
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.activeEventUnBind();
    };
    _proto.isColumnVisible = function isColumnVisible(key) {
        var partial = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return this.visibleCommon(false, key, partial);
    };
    _proto.isRowVisible = function isRowVisible(key) {
        var partial = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        return this.visibleCommon(true, key, partial);
    };
    _proto.isCellVisible = function isCellVisible(rowKey, columnKey) {
        var partial = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
        var cell = this.table.getCell(rowKey, columnKey);
        if (partial) {
            return cell.isMount;
        }
        return this.isRowVisible(rowKey, partial) && this.isColumnVisible(columnKey, partial);
    };
    _proto.isFocus = function isFocus1(checkChildren) {
        return isFocus(this.config.el, checkChildren);
    };
    _proto.isActive = function isActive(is) {
        if (is !== undefined) {
            this._isControllableActive = is;
        }
        return this._isActive && this._isControllableActive;
    };
    _proto.isColumnExist = function isColumnExist(key) {
        return this.context.columnKeyIndexMap[key] !== undefined;
    };
    _proto.isRowExist = function isRowExist(key) {
        return this.context.dataKeyIndexMap[key] !== undefined;
    };
    _proto.isColumnExistByIndex = function isColumnExistByIndex(ind) {
        return this.context.columns[ind] !== undefined;
    };
    _proto.isRowExistByIndex = function isRowExistByIndex(ind) {
        return this.context.data[ind] !== undefined;
    };
    _proto.isRowLike = function isRowLike(row) {
        return row && typeof row.key === "string" && typeof row.height === "number" && typeof row.y === "number";
    };
    _proto.isColumnLike = function isColumnLike(column) {
        return column && typeof column.key === "string" && typeof column.height === "number" && typeof column.x === "number";
    };
    _proto.isCellLike = function isCellLike(cell) {
        return cell && typeof cell.key === "string" && !!cell.row && !!cell.column;
    };
    _proto.isTableKey = function isTableKey(key) {
        return isString(key) || isNumber(key);
    };
    // isColumnVisible/isRowVisible通用逻辑
    _proto.visibleCommon = function visibleCommon(isRow, key, partial) {
        var ctx = this.context;
        var current = isRow ? this.table.getRow(key) : this.table.getColumn(key);
        if (current.isFixed) return true;
        var rowCur = current;
        var colCur = current;
        var size = isRow ? rowCur.height : colCur.width;
        var contStart = isRow ? rowCur.y : colCur.x;
        var contEnd = contStart + size;
        var pos = isRow ? this.table.getY() : this.table.getX();
        var tableSize = isRow ? this.table.getHeight() : this.table.getWidth();
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
    // 尽可能满足所有符合active的情况
    _proto.activeEventBind = function activeEventBind() {
        document.documentElement.addEventListener("mousedown", this.onIsActiveCheck);
        document.documentElement.addEventListener("touchstart", this.onIsActiveCheck);
        this.config.el.addEventListener("mouseenter", this.onIsActiveCheck);
        this.context.viewEl.addEventListener("scroll", this.onActive);
        this.config.el.addEventListener("focus", this.onActive);
        window.addEventListener("blur", this.onWindowBlur);
    };
    _proto.activeEventUnBind = function activeEventUnBind() {
        document.documentElement.removeEventListener("mousedown", this.onIsActiveCheck);
        document.documentElement.removeEventListener("touchstart", this.onIsActiveCheck);
        this.config.el.removeEventListener("mouseenter", this.onIsActiveCheck);
        this.context.viewEl.removeEventListener("scroll", this.onActive);
        this.config.el.removeEventListener("focus", this.onActive);
        window.removeEventListener("blur", this.onWindowBlur);
    };
    return _TableIsPlugin;
}(TablePlugin);
