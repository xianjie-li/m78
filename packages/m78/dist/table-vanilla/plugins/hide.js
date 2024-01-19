import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { _TableMetaDataPlugin } from "./meta-data.js";
import { SelectManager } from "@m78/utils";
/**
 * 表格列隐藏
 *
 * 通过为隐藏项添加meta.ignore实现, ignore状态为额外维护的, 放置与默认的产生冲突
 * */ export var _TableHidePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableHidePlugin, TablePlugin);
    var _super = _create_super(_TableHidePlugin);
    function _TableHidePlugin() {
        _class_call_check(this, _TableHidePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "metaData", void 0);
        // 检测是否隐藏
        _define_property(_assert_this_initialized(_this), "hideChecker", new SelectManager());
        return _this;
    }
    _create_class(_TableHidePlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.metaData = this.getPlugin(_TableMetaDataPlugin);
                this.metaData.extraColumnIgnoreChecker.push(this.hideChecker);
            }
        },
        {
            key: "loadStage",
            value: function loadStage(stage, isBefore) {
                if (stage === TableLoadStage.indexHandle && isBefore) {
                    this.handle();
                }
            }
        },
        {
            key: "handle",
            value: function handle() {
                this.hideChecker.setAllSelected(this.context.persistenceConfig.hideColumns || []);
            }
        },
        {
            /** 是否为隐藏列 */ key: "isHideColumn",
            value: function isHideColumn(key) {
                return this.hideChecker.isSelected(key);
            }
        }
    ]);
    return _TableHidePlugin;
}(TablePlugin);
