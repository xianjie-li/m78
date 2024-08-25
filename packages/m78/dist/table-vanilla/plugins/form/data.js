import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { deleteNamePathValue, deleteNamePathValues, simplyDeepClone } from "@m78/utils";
export var _MixinData = /*#__PURE__*/ function() {
    "use strict";
    function _MixinData() {
        _class_call_check(this, _MixinData);
    }
    _create_class(_MixinData, [
        {
            key: "getData",
            value: function getData() {
                return this.innerGetData();
            }
        },
        {
            key: "innerGetData",
            value: // getData的内部版本, 可在每一次遍历时回调, 可以选择跟eachData一样中断或跳过数据, cb与this.eachData的cb一致
            // innerGetData和eachData在回调中为加入异步行为时才会异步执行, 本身是同步的, 使用promise api仅是为了兼容更多用法
            function innerGetData(cb) {
                var _this = this;
                return _async_to_generator(function() {
                    var add, change, update, remove, hasBreak, all, rList;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                add = [];
                                change = [];
                                update = [];
                                remove = [];
                                hasBreak = false;
                                return [
                                    4,
                                    _this.eachData(function() {
                                        var _ref = _async_to_generator(function(data, key, status) {
                                            var push, res;
                                            return _ts_generator(this, function(_state) {
                                                switch(_state.label){
                                                    case 0:
                                                        push = function() {
                                                            if (status.add) add.push(data);
                                                            if (status.change) change.push(data);
                                                            if (status.update) update.push(data);
                                                        };
                                                        if (!cb) {
                                                            push();
                                                            return [
                                                                2
                                                            ];
                                                        }
                                                        return [
                                                            4,
                                                            cb(data, key, status)
                                                        ];
                                                    case 1:
                                                        res = _state.sent();
                                                        if (res === 0) hasBreak = true;
                                                        if (res === 0 || res === false) return [
                                                            2,
                                                            res
                                                        ]; // 异常返回原样返回给eachData
                                                        push();
                                                        return [
                                                            2
                                                        ];
                                                }
                                            });
                                        });
                                        return function(data, key, status) {
                                            return _ref.apply(this, arguments);
                                        };
                                    }())
                                ];
                            case 1:
                                all = _state.sent();
                                if (hasBreak) return [
                                    2,
                                    null
                                ];
                                rList = Array.from(_this.removeRecordMap.values());
                                if (rList) remove = rList;
                                // 合并软删除项到remove
                                if (_this.softRemove.remove.hasSelected()) {
                                    _this.softRemove.remove.getState().selected.forEach(function(k) {
                                        if (_this.removeRecordMap.has(k)) return; // 跳过已直接删除的项
                                        if (_this.addRecordMap.has(k)) return; // 跳过新增的项
                                        var rmRow = _this.table.getRow(k);
                                        remove.push(rmRow.data);
                                    });
                                }
                                return [
                                    2,
                                    {
                                        change: change,
                                        add: add,
                                        remove: remove,
                                        update: update,
                                        all: all,
                                        sorted: _this.getSortedStatus()
                                    }
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "eachData",
            value: /** 遍历所有数据(不包含fake/软删除数据)并返回其clone版本
   *
   * - 若cb返回false则跳过并将该条数据从返回list中过滤, 返回0时, 停止遍历, 返回已遍历的值
   * - 数据会对invalid的值进行移除处理, 可通过 handleInvalid 控制
   * */ function eachData(cb) {
                var handleInvalid = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                var _this = this;
                return _async_to_generator(function() {
                    var list, d, j, i, key, meta, data, isAdd, isChange, isUpdate, res;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                list = [];
                                d = _this.context.data;
                                j = 0;
                                _state.label = 1;
                            case 1:
                                if (!(j < d.length)) return [
                                    3,
                                    4
                                ];
                                i = d[j];
                                key = _this.table.getKeyByRowData(i);
                                meta = _this.context.getRowMeta(key);
                                if (meta.fake) return [
                                    3,
                                    3
                                ];
                                if (_this.softRemove.isSoftRemove(key)) return [
                                    3,
                                    3
                                ];
                                data = handleInvalid ? _this.getFmtData(key, i) : simplyDeepClone(i);
                                isAdd = _this.addRecordMap.has(key);
                                // 新增数据删除虚拟主键, 防止数据传输到服务端时出错
                                if (isAdd) {
                                    deleteNamePathValue(data, _this.config.primaryKey);
                                }
                                // 变更过且不是新增的数据
                                isChange = !isAdd && _this.getChanged(key);
                                isUpdate = isAdd || isChange;
                                return [
                                    4,
                                    cb(data, key, {
                                        add: isAdd,
                                        change: isChange,
                                        update: isUpdate
                                    })
                                ];
                            case 2:
                                res = _state.sent();
                                if (res === 0) return [
                                    3,
                                    4
                                ];
                                if (res === false) return [
                                    3,
                                    3
                                ];
                                list.push(data);
                                _state.label = 3;
                            case 3:
                                j++;
                                return [
                                    3,
                                    1
                                ];
                            case 4:
                                return [
                                    2,
                                    list
                                ];
                        }
                    });
                })();
            }
        },
        {
            // 获取处理invalid项后的data, data会经过clone
            key: "getFmtData",
            value: function getFmtData(row, data) {
                var invalid = this.getSchemas(row).invalidNames;
                data = simplyDeepClone(data);
                if (invalid === null || invalid === void 0 ? void 0 : invalid.length) {
                    deleteNamePathValues(data, invalid);
                }
                return data;
            }
        }
    ]);
    return _MixinData;
}();
