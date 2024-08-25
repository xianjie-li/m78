import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
export var _MixinBase = /*#__PURE__*/ function() {
    "use strict";
    function _MixinBase() {
        _class_call_check(this, _MixinBase);
        _define_property(this, "wrapNode", void 0);
        // 验证实例, 用于在未创建行form时复用
        _define_property(this, "verifyInstance", void 0);
        // 以行为单位存储单元格错误信息 { [rowKey]: { [columnKey]: "err msg" } }
        _define_property(this, "cellErrors", new Map());
        // 记录行是否变动
        _define_property(this, "rowChanged", new Map());
        // 记录单元格是否变动
        _define_property(this, "cellChanged", new Map());
        // 以行为key记录默认值
        _define_property(this, "defaultValues", new Map());
        // 以row key存储的改行的计算后schema
        _define_property(this, "schemaDatas", new Map());
        // 记录新增的数据
        _define_property(this, "addRecordMap", new Map());
        // 记录移除的数据
        _define_property(this, "removeRecordMap", new Map());
        // 记录移除的数据, 不进行 addRecordMap 的检测, 即 removeRecordMap 不会记录新增行的删除, 而 allRemoveRecordMap 会记录
        _define_property(this, "allRemoveRecordMap", new Map());
        // 记录发生或排序变更的项信息
        _define_property(this, "sortRecordMap", new Map());
        _define_property(this, "interactive", void 0);
        _define_property(this, "softRemove", void 0);
        /* # # # # # # # 与schema相关的标记渲染, editable & valid # # # # # # # */ // 以列为key存储可编辑列的信息
        _define_property(this, "editStatusMap", new Map());
        // 无效单元格标记
        _define_property(this, "invalidList", []);
        // 处理两者的函数
        _define_property(this, "schemasMarkCB", void 0);
        // 编辑/必填状态标识节点
        _define_property(this, "editStatusNodes", []);
        // 无效反馈节点
        _define_property(this, "invalidNodes", []);
        /* # # # # # # # 与schema相关的标记渲染 End # # # # # # # */ /* # # # # # # # cell error render # # # # # # # */ // 用于updateErrors()的待展示列表
        _define_property(this, "errorsList", []);
        // 存储错误信息的回调
        _define_property(this, "updateErrorsCB", void 0);
        // 用于显示错误标识的节点
        _define_property(this, "errorsNodes", []);
        /* # # # # # # # cell error render End # # # # # # # */ /* # # # # # # # row mark # # # # # # # */ // 用于updateRowMark()的待展示列表
        _define_property(this, "rowMarkList", []);
        // 存储变更信息的回调
        _define_property(this, "updateRowMarkCB", void 0);
        // 用于显示行变动标识的节点
        _define_property(this, "rowChangedNodes", []);
        /* # # # # # # # row mark End # # # # # # # */ /* # # # # # # # changed cell mark # # # # # # # */ // 用于updateChangedCell()的最终cell列表
        _define_property(this, "changedCellList", []);
        // 存储记录变更信息的回调
        _define_property(this, "changedCellCB", void 0);
        // 用于显示单元格变动标识的节点
        _define_property(this, "cellChangedNodes", []);
    }
    _create_class(_MixinBase, [
        {
            /* # # # # # # # changed cell End # # # # # # # */ /** 获取verify实例 */ key: "getVerify",
            value: function getVerify() {
                return this.verifyInstance;
            }
        }
    ]);
    return _MixinBase;
}();
