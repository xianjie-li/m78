import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { TableReloadLevel } from "./life.js";
/**
 * 管理存储在行/列或其他数据中的元信息以及对应的key
 * */ export var _TableMetaDataPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableMetaDataPlugin, TablePlugin);
    var _super = _create_super(_TableMetaDataPlugin);
    function _TableMetaDataPlugin() {
        _class_call_check(this, _TableMetaDataPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        // 行元数据
        _define_property(_assert_this_initialized(_this), "rowMeta", new Map());
        // 列元数据
        _define_property(_assert_this_initialized(_this), "columnMeta", new Map());
        // 单元格元数据
        _define_property(_assert_this_initialized(_this), "cellMeta", new Map());
        // 额外用于检测ignore的检测器, 用于放置不同功间共同管理ignore状态时冲突
        _define_property(_assert_this_initialized(_this), "extraRowIgnoreChecker", []);
        // 额外用于检测ignore的检测器, 用于放置不同功间共同管理ignore状态时冲突
        _define_property(_assert_this_initialized(_this), "extraColumnIgnoreChecker", []);
        return _this;
    }
    _create_class(_TableMetaDataPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.methodMapper(this.context, [
                    "getRowMeta",
                    "getColumnMeta",
                    "isIgnoreRow",
                    "isIgnoreColumn"
                ]);
            }
        },
        {
            key: "reload",
            value: function reload(opt) {
                if (opt.level === TableReloadLevel.full) {
                    this.rowMeta.clear();
                    this.columnMeta.clear();
                }
            }
        },
        {
            key: "isIgnoreRow",
            value: function isIgnoreRow(key, meta) {
                var _meta = meta || this.getRowMeta(key);
                var ignore = !!_meta.ignore;
                if (ignore) return true;
                for(var i = 0; i < this.extraRowIgnoreChecker.length; i++){
                    var checker = this.extraRowIgnoreChecker[i];
                    if (checker.isSelected(key)) return true;
                }
                return false;
            }
        },
        {
            key: "isIgnoreColumn",
            value: function isIgnoreColumn(key, meta) {
                var _meta = meta || this.getColumnMeta(key);
                var ignore = !!_meta.ignore;
                if (ignore) return true;
                for(var i = 0; i < this.extraColumnIgnoreChecker.length; i++){
                    var checker = this.extraColumnIgnoreChecker[i];
                    if (checker.isSelected(key)) return true;
                }
                return false;
            }
        },
        {
            key: "getRowMeta",
            value: function getRowMeta(key) {
                var m = this.rowMeta.get(key);
                if (!m) {
                    m = {};
                    this.rowMeta.set(key, m);
                }
                return m;
            }
        },
        {
            key: "getColumnMeta",
            value: function getColumnMeta(key) {
                var m = this.columnMeta.get(key);
                if (!m) {
                    m = {};
                    this.columnMeta.set(key, m);
                }
                return m;
            }
        }
    ]);
    return _TableMetaDataPlugin;
}(TablePlugin);
/** 记录当前reloadKey */ _define_property(_TableMetaDataPlugin, "RELOAD_KEY", "__M78TableReloadKey");
/** 挂载渲染标记 */ _define_property(_TableMetaDataPlugin, "RENDERED_KEY", "__M78TableRenderFlag");
/** 与对象有关的某个timer */ _define_property(_TableMetaDataPlugin, "TIMER_KEY", "__M78TableTimer");
