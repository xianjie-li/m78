import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _class_private_field_get from "@swc/helpers/src/_class_private_field_get.mjs";
import _class_private_field_init from "@swc/helpers/src/_class_private_field_init.mjs";
import _class_private_field_set from "@swc/helpers/src/_class_private_field_set.mjs";
import _class_private_method_get from "@swc/helpers/src/_class_private_method_get.mjs";
import _class_private_method_init from "@swc/helpers/src/_class_private_method_init.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
import { createEvent, isFunction, isString, isTruthyOrZero } from "@m78/utils";
var /** 将list映射为字典, 减少循环的频率, 若i为非0 falsy值, 则存储为null, 取值时取v(减少存储占用的内存) */ _listMap = /*#__PURE__*/ new WeakMap(), /** 已选值, 如果存在key则为已选, val存放选中的值(相对于key可以保留实际类型) */ _selectedMap = /*#__PURE__*/ new WeakMap(), /** 根据当前的option.list同步listMap */ _syncListMap = /*#__PURE__*/ new WeakSet(), _lockFlag = /*#__PURE__*/ new WeakMap(), /** 锁定change触发器, 锁定期间其他触发器调用不会触发 */ _lock = /*#__PURE__*/ new WeakSet(), /** 触发变更实际, 搭配changeLock使用 */ _emitChange = /*#__PURE__*/ new WeakSet();
/**
 * partialSelected / allSelected 仅检测list中存在的权限
 * selectAll / toggleAll 仅选中list中存在的选项
 * */ /**
 * 用于列表的选中项管理, 内置了对于超大数据量的优化
 *
 * - 怪异选中, 如果选中了list中不存在的选项, 称为怪异选中, 可以通过 selected.strangeSelected 访问这些选项, 存在此行为时, 以下api行为需要注意:
 * partialSelected / allSelected 仅检测list中存在的权限
 * selectAll / toggleAll 仅选中list中存在的选项
 * */ export var SelectManager = /*#__PURE__*/ function() {
    "use strict";
    function SelectManager(option) {
        _class_call_check(this, SelectManager);
        _class_private_method_init(this, _syncListMap);
        _class_private_method_init(this, _lock);
        _class_private_method_init(this, _emitChange);
        _class_private_field_init(this, _listMap, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _selectedMap, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _lockFlag, {
            writable: true,
            value: void 0
        });
        this.option = option;
        _class_private_field_set(this, _listMap, {});
        _class_private_field_set(this, _selectedMap, {});
        _class_private_field_set(this, _lockFlag, 1);
        this.changeEvent = createEvent();
        _class_private_method_get(this, _syncListMap, syncListMap).call(this);
    }
    var _proto = SelectManager.prototype;
    /** 从list项中获取值(根据valueMapper) */ _proto.getValueByItem = function getValueByItem(i) {
        var valueMapper = this.option.valueMapper;
        var v;
        if (isString(valueMapper)) {
            v = i[valueMapper];
        } else if (isFunction(valueMapper)) {
            v = valueMapper(i);
        } else {
            v = i;
        }
        return v;
    };
    /** 值是否在list中存在 */ _proto.isWithinList = function isWithinList(val) {
        return !!_class_private_field_get(this, _listMap)[val];
    };
    /** 检测值是否被选中 */ _proto.isSelected = function isSelected(val) {
        return String(val) in _class_private_field_get(this, _selectedMap);
    };
    /** 重新设置option.list */ _proto.setList = function setList(list) {
        this.option.list = list;
        _class_private_method_get(this, _syncListMap, syncListMap).call(this);
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 选中传入的值 */ _proto.select = function select(val) {
        _class_private_field_get(this, _selectedMap)[val] = val;
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 取消选中传入的值 */ _proto.unSelected = function unSelected(val) {
        delete _class_private_field_get(this, _selectedMap)[val];
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 选择全部值 */ _proto.selectAll = function selectAll() {
        for(var key in _class_private_field_get(this, _listMap)){
            _class_private_field_get(this, _selectedMap)[key] = _class_private_field_get(this, _listMap)[key].v;
        }
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 取消选中所有值 */ _proto.unSelectAll = function unSelectAll() {
        _class_private_field_set(this, _selectedMap, {});
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 反选值 */ _proto.toggle = function toggle(val) {
        var unlock = _class_private_method_get(this, _lock, lock).call(this);
        if (this.isSelected(val)) {
            this.unSelected(val);
        } else {
            this.select(val);
        }
        unlock();
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 反选所有值 */ _proto.toggleAll = function toggleAll() {
        var unlock = _class_private_method_get(this, _lock, lock).call(this);
        for(var key in _class_private_field_get(this, _listMap)){
            this.toggle(key);
        }
        unlock();
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 一次性设置所有选中的值 */ _proto.setAllSelected = function setAllSelected(next) {
        var _this = this;
        _class_private_field_set(this, _selectedMap, {});
        next.forEach(function(val) {
            return _class_private_field_get(_this, _selectedMap)[val] = val;
        });
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 设置指定值的选中状态 */ _proto.setSelected = function setSelected(val, isSelect) {
        var unlock = _class_private_method_get(this, _lock, lock).call(this);
        if (isSelect) {
            this.select(val);
        } else {
            this.unSelected(val);
        }
        unlock();
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 一次选中多个选项 */ _proto.selectList = function selectList(selectList1) {
        var _this = this;
        selectList1.forEach(function(val) {
            return _class_private_field_get(_this, _selectedMap)[val] = val;
        });
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    /** 以列表的形式移除选中项 */ _proto.unSelectList = function unSelectList(selectList) {
        var _this = this;
        selectList.forEach(function(key) {
            return delete _class_private_field_get(_this, _selectedMap)[key];
        });
        _class_private_method_get(this, _emitChange, emitChange).call(this);
    };
    _create_class(SelectManager, [
        {
            key: "selected",
            get: /** 当前选中项的信息 */ function get() {
                var _this = this;
                var originalSelected = [];
                var realSelected = [];
                var strangeSelected = [];
                for(var key in _class_private_field_get(this, _selectedMap)){
                    var i = _class_private_field_get(this, _listMap)[key];
                    if (i) {
                        originalSelected.push(i.i === null ? i.v : i.i);
                        realSelected.push(i.v);
                    } else {
                        var v = _class_private_field_get(this, _selectedMap)[key];
                        originalSelected.push(v);
                        strangeSelected.push(v);
                    }
                }
                var selected = originalSelected.map(function(i) {
                    return _this.getValueByItem(i);
                });
                return {
                    originalSelected: originalSelected,
                    selected: selected,
                    realSelected: realSelected,
                    strangeSelected: strangeSelected
                };
            }
        },
        {
            key: "partialSelected",
            get: /** list中部分值被选中, 不计入strangeSelected */ function get() {
                for(var key in _class_private_field_get(this, _selectedMap)){
                    if (this.isWithinList(key)) return true;
                }
                return false;
            }
        },
        {
            key: "allSelected",
            get: /** 当前list中的选项是否全部选中, 不计入strangeSelected */ function get() {
                var meta = this.selected;
                var realLength = meta.selected.length - meta.strangeSelected.length;
                return realLength === this.option.list.length;
            }
        }
    ]);
    return SelectManager;
}();
function syncListMap() {
    var _this = this;
    _class_private_field_set(this, _listMap, {});
    this.option.list.forEach(function(i) {
        var v = _this.getValueByItem(i);
        var type = typeof v === "undefined" ? "undefined" : _type_of(v);
        if (v === undefined || type !== "string" && type !== "number") return;
        _class_private_field_get(_this, _listMap)[v] = {
            v: v,
            i: isTruthyOrZero(i) ? i : null
        };
    });
}
function lock() {
    var _this = this;
    if (_class_private_field_get(this, _lockFlag) === 1) {
        _class_private_field_set(this, _lockFlag, 0);
        return function() {
            return _class_private_field_set(_this, _lockFlag, 1);
        };
    }
    return function() {};
}
function emitChange() {
    if (!_class_private_field_get(this, _lockFlag)) return;
    this.changeEvent.emit();
}
