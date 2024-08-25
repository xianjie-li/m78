import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { _TableInitPlugin } from "./init.js";
import { createRandString, getNamePathValue, isNumber, setNamePathValue } from "@m78/utils";
import { _privateInstanceKey, _privateScrollerDomKey } from "../common.js";
import { _TableRenderPlugin } from "./render.js";
import { removeNode } from "../../common/index.js";
import { _TableFormPlugin } from "./form/form.js";
import { _TableSoftRemovePlugin } from "./soft-remove.js";
import { rafCaller } from "@m78/animate-tools";
/** 表格生命周期相关控制 */ export var _TableLifePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableLifePlugin, TablePlugin);
    var _super = _create_super(_TableLifePlugin);
    function _TableLifePlugin() {
        _class_call_check(this, _TableLifePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 优化reload函数 */ _define_property(_assert_this_initialized(_this), "rafCaller", void 0);
        /** 清理raf */ _define_property(_assert_this_initialized(_this), "rafClear", void 0);
        _define_property(_assert_this_initialized(_this), "formPlugin", void 0);
        _define_property(_assert_this_initialized(_this), "softRemove", void 0);
        _define_property(_assert_this_initialized(_this), "takeover", function(cb) {
            var ctx = _this.context;
            var obtain = !ctx.takeKey;
            if (obtain) {
                ctx.takeKey = createRandString(2);
            }
            cb();
            if (obtain) {
                _this.context.takeKey = undefined;
                if (_this.context.takeReload) {
                    if (_this.context.takeSyncReload) {
                        _this.table.reloadSync(_this.context.takeReloadOptions);
                    } else {
                        _this.table.reload(_this.context.takeReloadOptions);
                    }
                } else {
                    if (_this.context.takeSyncRender) {
                        _this.table.renderSync();
                    } else {
                        _this.table.render();
                    }
                }
                _this.context.takeReload = false;
                _this.context.takeSyncReload = false;
                _this.context.takeSyncRender = false;
                _this.context.takeReloadOptions = undefined;
            }
        });
        return _this;
    }
    _create_class(_TableLifePlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.methodMapper(this.table, [
                    [
                        "reloadHandle",
                        "reload"
                    ],
                    [
                        "destroyHandle",
                        "destroy"
                    ],
                    "reloadSync",
                    "takeover",
                    "isTaking",
                    "resetStatus"
                ]);
            }
        },
        {
            key: "init",
            value: function init() {
                this.formPlugin = this.getPlugin(_TableFormPlugin);
                this.softRemove = this.getPlugin(_TableSoftRemovePlugin);
                this.context.lastReloadKey = createRandString();
                this.rafCaller = rafCaller();
            }
        },
        {
            key: "initialized",
            value: function initialized() {
                // 在节点上写入实例信息, 防止热重载等场景下反复创建实例
                setNamePathValue(this.config.el, _privateInstanceKey, this.table);
            }
        },
        {
            /** 解除所有事件/引用类型占用 */ key: "beforeDestroy",
            value: function beforeDestroy() {
                if (this.rafClear) this.rafClear();
                var ctx = this.context;
                this.getPlugin(_TableRenderPlugin).restoreWrapSize();
                ctx.data = [];
                ctx.columns = [];
                ctx.rows = {};
                ctx.cells = {};
                ctx.rowCache = {};
                ctx.columnCache = {};
                ctx.cellCache = {};
                ctx.yHeaderKeys = [];
                ctx.ignoreXList = [];
                ctx.ignoreYList = [];
                this.commonAction();
                // 如果是内部创建的dom容器, 将其移除
                if (getNamePathValue(ctx.viewEl, _privateScrollerDomKey)) {
                    removeNode(this.context.viewEl);
                } else {
                    ctx.viewContentEl.style.width = "auto";
                    ctx.viewContentEl.style.height = "auto";
                }
                setNamePathValue(this.table, "history", undefined);
                setNamePathValue(this.table, "canvasElement", undefined);
                setNamePathValue(ctx, "domEl", undefined);
                setNamePathValue(ctx, "domContentEl", undefined);
            }
        },
        {
            /** 核心reload逻辑 */ key: "reload",
            value: function reload() {
                var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, keepPosition = _ref.keepPosition, _ref_level = _ref.level, level = _ref_level === void 0 ? 0 : _ref_level;
                var ctx = this.context;
                var viewport = this.getPlugin(_TableRenderPlugin);
                ctx.lastReloadKey = createRandString();
                this.commonAction();
                if (!keepPosition) {
                    ctx.viewEl.scrollTop = 0;
                    ctx.viewEl.scrollLeft = 0;
                }
                var initPlugin = this.getPlugin(_TableInitPlugin);
                if (level === 0) {
                    initPlugin.baseHandle();
                } else if (level === 1) {
                    initPlugin.indexHandle();
                } else {
                    this.table.history.reset();
                    initPlugin.fullHandle();
                }
                viewport.updateDom();
                viewport.renderSync();
            }
        },
        {
            /** 实现table.reload() */ key: "reloadHandle",
            value: function reloadHandle(opt) {
                var _this = this;
                // 实现 takeover
                if (this.context.takeKey) {
                    this.context.takeReload = true;
                    this.mergeTakeReloadOptions(opt);
                    return;
                }
                this.rafCaller(function() {
                    return _this.reloadMain(opt);
                });
            }
        },
        {
            /** reloadHandle的同步版本 */ key: "reloadSync",
            value: function reloadSync(opt) {
                // 实现 takeover
                if (this.context.takeKey) {
                    this.context.takeReload = true;
                    this.context.takeSyncReload = true;
                    this.mergeTakeReloadOptions(opt);
                    return;
                }
                this.reloadMain(opt);
            }
        },
        {
            /** 触发插件reload */ key: "reloadMain",
            value: function reloadMain() {
                var opt = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                this.plugins.forEach(function(plugin) {
                    var _plugin_reload;
                    (_plugin_reload = plugin.reload) === null || _plugin_reload === void 0 ? void 0 : _plugin_reload.call(plugin, opt);
                });
                this.table.event.reload.emit(opt);
            }
        },
        {
            /** 实现table.destroy() */ key: "destroyHandle",
            value: function destroyHandle() {
                var _this = this;
                setNamePathValue(this.config.el, _privateInstanceKey, undefined);
                /* # # # # # # # beforeDestroy # # # # # # # */ this.plugins.forEach(function(plugin) {
                    var _plugin_beforeDestroy;
                    if (plugin === _this) return; // 当前组件需要最后执行beforeDestroy
                    (_plugin_beforeDestroy = plugin.beforeDestroy) === null || _plugin_beforeDestroy === void 0 ? void 0 : _plugin_beforeDestroy.call(plugin);
                });
                this.beforeDestroy();
                this.table.event.beforeDestroy.emit();
            }
        },
        {
            /** 是否正在执行takeover */ key: "isTaking",
            value: function isTaking() {
                return !!this.context.takeKey;
            }
        },
        {
            key: "resetStatus",
            value: function resetStatus() {
                var _this = this;
                this.table.takeover(function() {
                    _this.formPlugin.resetStatus();
                    _this.softRemove.confirmSoftRemove();
                    _this.table.history.reset();
                    _this.table.render();
                });
            }
        },
        {
            key: "mergeTakeReloadOptions",
            value: /** 对不同的reloadOpt进行特殊合并 */ function mergeTakeReloadOptions(opt) {
                var ctxOpt = this.context.takeReloadOptions;
                if (!ctxOpt && opt) {
                    this.context.takeReloadOptions = opt;
                    return;
                }
                if (!ctxOpt) return;
                var level = opt === null || opt === void 0 ? void 0 : opt.level;
                var keepPosition = opt === null || opt === void 0 ? void 0 : opt.keepPosition;
                // 取最高的level
                if (isNumber(level)) {
                    if (level >= (ctxOpt.level || 0)) {
                        ctxOpt.level = level;
                    }
                }
                // 有任意一次不保持位置, 则不保持位置
                if (ctxOpt.keepPosition === false) return;
                ctxOpt.keepPosition = keepPosition;
            }
        },
        {
            key: "commonAction",
            value: function commonAction() {
                var ctx = this.context;
                ctx.lastViewportItems = undefined;
                ctx.lastMountRows = {};
                ctx.lastMountColumns = {};
                ctx.topFixedMap = {};
                ctx.bottomFixedMap = {};
                ctx.leftFixedMap = {};
                ctx.rightFixedMap = {};
                ctx.mergeMapMain = {};
                ctx.mergeMapSub = {};
                ctx.lastMergeXMap = {};
                ctx.lastMergeYMap = {};
                ctx.stageEL.innerHTML = ""; // 清空
            }
        }
    ]);
    return _TableLifePlugin;
}(TablePlugin);
export var TableReloadLevel;
(function(TableReloadLevel) {
    /** 基础信息计算, 比如固定/合并/尺寸等信息, 计算比较快速 */ TableReloadLevel[TableReloadLevel["base"] = 0] = "base";
    /** 重新计算索引, 通常在组件内部备份的data和columns顺序变更时使用, 组件使用者很少会使用到此级别, 由于包含了对data/column的遍历, 性能消耗会更高 */ TableReloadLevel[TableReloadLevel["index"] = 1] = "index";
    /** 重要配置发生了变更, 比如data/column完全改变, 会执行初始化阶段的大部分操作 */ TableReloadLevel[TableReloadLevel["full"] = 2] = "full";
})(TableReloadLevel || (TableReloadLevel = {}));
