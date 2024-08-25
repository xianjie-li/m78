import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _getCellKey } from "../../common.js";
import { stringifyNamePath } from "@m78/utils";
/** form状态相关 */ export var _MixinStatus = /*#__PURE__*/ function() {
    "use strict";
    function _MixinStatus() {
        _class_call_check(this, _MixinStatus);
    }
    _create_class(_MixinStatus, [
        {
            key: "getChanged",
            value: function getChanged(rowKey, columnKey) {
                // 检测已有状态
                if (columnKey) {
                    var cellKey = _getCellKey(rowKey, stringifyNamePath(columnKey));
                    if (this.cellChanged.get(cellKey)) return true;
                } else {
                    if (this.rowChanged.get(rowKey)) return true;
                }
                // 新增行的检测均视为变更
                if (this.addRecordMap.has(rowKey)) return true;
                // 删除行的检测均视为变更
                if (this.removeRecordMap.has(rowKey)) return true;
                if (this.softRemove.isSoftRemove(rowKey)) return true;
                // 排序变更
                var sortData = this.sortRecordMap.get(rowKey);
                if (sortData && sortData.currentIndex !== sortData.originIndex) return true;
                return false;
            }
        },
        {
            key: "getTableChanged",
            value: function getTableChanged() {
                if (this.rowChanged.size !== 0) return true;
                // 包含新增或删除的行
                if (this.addRecordMap.size || this.removeRecordMap.size) return true;
                // 包含软删除数据
                if (this.softRemove.remove.hasSelected()) return true;
                var hasSorted = this.getSortedStatus();
                // 包含排序过的行
                if (hasSorted) return true;
                // 包含变更数据
                return false;
            }
        },
        {
            /** 检测是否发生了数据排序 */ key: "getSortedStatus",
            value: function getSortedStatus() {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                return Array.from(this.sortRecordMap.entries()).some(function(param) {
                    var _param = _sliced_to_array(param, 2), _ = _param[0], rec = _param[1];
                    return rec.currentIndex !== rec.originIndex;
                });
            }
        },
        {
            /** 获取当前显示的列的可编辑情况, 显示的所有行中任意一行的改列可编辑即视为可编辑 */ key: "getEditStatus",
            value: function getEditStatus(col) {
                return this.editStatusMap.get(col.key) || null;
            }
        },
        {
            key: "getChangeStatus",
            value: function getChangeStatus() {
                var _this = this;
                var ctx = this.context;
                var length = ctx.data.length - ctx.yHeaderKeys.length;
                length = length - this.softRemove.remove.getState().selected.length;
                var add = 0;
                this.addRecordMap.forEach(function(v, k) {
                    if (_this.softRemove.isSoftRemove(k)) return; // 软删除的行不视为新增
                    add++;
                });
                var change = 0;
                // 变更数量需排除掉新增行o
                this.rowChanged.forEach(function(v, k) {
                    if (_this.addRecordMap.has(k)) return;
                    change++;
                });
                var remove = this.removeRecordMap.size;
                if (this.softRemove.remove.hasSelected()) {
                    this.softRemove.remove.getState().selected.forEach(function(k) {
                        if (_this.removeRecordMap.has(k)) return; // 跳过已直接删除的项
                        if (_this.addRecordMap.has(k)) return; // 跳过新增的项
                        remove++;
                    });
                }
                return {
                    length: length,
                    add: add,
                    change: change,
                    update: add + change,
                    remove: remove,
                    sorted: this.getSortedStatus()
                };
            }
        }
    ]);
    return _MixinStatus;
}();
