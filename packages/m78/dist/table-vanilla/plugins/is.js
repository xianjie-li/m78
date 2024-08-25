import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
        /** 内部isActive状态 */ _define_property(_assert_this_initialized(_this), "_isActive", false);
        /** 可由用户控制的active状态, 和_isActive一起构成active状态  */ _define_property(_assert_this_initialized(_this), "_isControllableActive", true);
        // 开始滚动时更新isActive
        _define_property(_assert_this_initialized(_this), "onActive", debounce(function() {
            if (_this._isActive) return;
            _this._isActive = true;
            addCls(_this.config.el, "__active");
        }, 200, {
            leading: true,
            trailing: false
        }));
        // 点击/移入时更新isActive
        _define_property(_assert_this_initialized(_this), "onIsActiveCheck", debounce(function(e) {
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
                if (_this.config.extraActiveCheckEl) {
                    var _rect = _this.config.extraActiveCheckEl.getBoundingClientRect();
                    rect = _object_spread_props(_object_spread({}, rect), {
                        left: Math.min(rect.left, _rect.left),
                        top: Math.min(rect.top, _rect.top),
                        right: Math.max(rect.right, _rect.right),
                        bottom: Math.max(rect.bottom, _rect.bottom)
                    });
                }
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
        }));
        _define_property(_assert_this_initialized(_this), "onWindowBlur", function() {
            if (!_this._isActive) return;
            _this._isActive = false;
            removeCls(_this.config.el, "__active");
        });
        return _this;
    }
    _create_class(_TableIsPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
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
                    "isRowMount",
                    "isColumnMount"
                ]);
            }
        },
        {
            key: "mounted",
            value: function mounted() {
                this.activeEventBind();
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.activeEventUnBind();
            }
        },
        {
            key: "isColumnVisible",
            value: function isColumnVisible(key) {
                var partial = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                return this.visibleCommon(false, key, partial);
            }
        },
        {
            key: "isRowVisible",
            value: function isRowVisible(key) {
                var partial = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                return this.visibleCommon(true, key, partial);
            }
        },
        {
            key: "isCellVisible",
            value: function isCellVisible(rowKey, columnKey) {
                var partial = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
                var cell = this.table.getCell(rowKey, columnKey);
                if (partial) {
                    return cell.isMount;
                }
                return this.isRowVisible(rowKey, partial) && this.isColumnVisible(columnKey, partial);
            }
        },
        {
            key: "isRowMount",
            value: function isRowMount(key) {
                return !!this.context.lastMountRows[key];
            }
        },
        {
            key: "isColumnMount",
            value: function isColumnMount(key) {
                return !!this.context.lastMountColumns[key];
            }
        },
        {
            key: "isFocus",
            value: function isFocus1(checkChildren) {
                return isFocus(this.config.el, checkChildren);
            }
        },
        {
            key: "isActive",
            value: function isActive(is) {
                if (is !== undefined) {
                    this._isControllableActive = is;
                }
                return this._isActive && this._isControllableActive;
            }
        },
        {
            key: "isColumnExist",
            value: function isColumnExist(key) {
                return this.context.columnKeyIndexMap[key] !== undefined;
            }
        },
        {
            key: "isRowExist",
            value: function isRowExist(key) {
                return this.context.dataKeyIndexMap[key] !== undefined;
            }
        },
        {
            key: "isColumnExistByIndex",
            value: function isColumnExistByIndex(ind) {
                return this.context.columns[ind] !== undefined;
            }
        },
        {
            key: "isRowExistByIndex",
            value: function isRowExistByIndex(ind) {
                return this.context.data[ind] !== undefined;
            }
        },
        {
            key: "isRowLike",
            value: function isRowLike(row) {
                return row && typeof row.key === "string" && typeof row.height === "number" && typeof row.y === "number";
            }
        },
        {
            key: "isColumnLike",
            value: function isColumnLike(column) {
                return column && typeof column.key === "string" && typeof column.height === "number" && typeof column.x === "number";
            }
        },
        {
            key: "isCellLike",
            value: function isCellLike(cell) {
                return cell && typeof cell.key === "string" && !!cell.row && !!cell.column;
            }
        },
        {
            key: "isTableKey",
            value: function isTableKey(key) {
                return isString(key) || isNumber(key);
            }
        },
        {
            key: "visibleCommon",
            value: // isColumnVisible/isRowVisible通用逻辑
            function visibleCommon(isRow, key, partial) {
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
            }
        },
        {
            key: "activeEventBind",
            value: // 尽可能满足所有符合active的情况
            function activeEventBind() {
                document.documentElement.addEventListener("mousedown", this.onIsActiveCheck);
                document.documentElement.addEventListener("touchstart", this.onIsActiveCheck);
                this.config.el.addEventListener("mouseenter", this.onIsActiveCheck);
                this.config.el.addEventListener("focus", this.onActive);
                if (this.config.extraActiveCheckEl) {
                    this.config.extraActiveCheckEl.addEventListener("mouseenter", this.onIsActiveCheck);
                    this.config.extraActiveCheckEl.addEventListener("focus", this.onActive);
                }
                this.context.viewEl.addEventListener("scroll", this.onActive);
                window.addEventListener("blur", this.onWindowBlur);
            }
        },
        {
            key: "activeEventUnBind",
            value: function activeEventUnBind() {
                document.documentElement.removeEventListener("mousedown", this.onIsActiveCheck);
                document.documentElement.removeEventListener("touchstart", this.onIsActiveCheck);
                this.config.el.removeEventListener("mouseenter", this.onIsActiveCheck);
                this.config.el.removeEventListener("focus", this.onActive);
                if (this.config.extraActiveCheckEl) {
                    this.config.extraActiveCheckEl.removeEventListener("mouseenter", this.onIsActiveCheck);
                    this.config.extraActiveCheckEl.removeEventListener("focus", this.onActive);
                }
                this.context.viewEl.removeEventListener("scroll", this.onActive);
                window.removeEventListener("blur", this.onWindowBlur);
            }
        }
    ]);
    return _TableIsPlugin;
}(TablePlugin);
