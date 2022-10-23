import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { useFn, useFormState, useSelf } from "../../";
import { isArray } from "@m78/utils";
import _difference from "lodash/difference";
import { useMemo } from "react";
export function useCheck(conf) {
    var getEnables = /** 获取可用选项，禁用项会以原样返回， 传入false时，返回所有未禁用项 */ function getEnables() {
        var isCheck = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
        return items.filter(function(item) {
            var _isDisabled = isDisabled(item);
            if (_isDisabled) {
                return isChecked(item);
            }
            return isCheck;
        });
    };
    var getCheckedOptions = /** 获取所有已选中的选项 */ function getCheckedOptions(_checked) {
        if (!collector) return _checked;
        var temp = [];
        _checked.forEach(function(item) {
            var c = self.optMap[String(item)];
            if (c) {
                temp.push(c);
            }
        });
        return temp;
    };
    var getCheckStatus = /** 判断是否局部选中, 是否所有选中 */ function getCheckStatus() {
        var checkLen = 0;
        var maxLength = items.length;
        items.forEach(function(item) {
            if (isChecked(item)) {
                checkLen++;
            }
        });
        return {
            /** 部分值被选中 */ partialChecked: checkLen > 0 && checkLen !== maxLength,
            /** 是否全部选中 */ allChecked: checkLen === maxLength
        };
    };
    var valMapSync = /** 同步valMap, 触发notExistVal  */ function valMapSync(_checked) {
        if (!isArray(_checked)) return; // 在rc-form库中使用时，热更新会报错
        var prevNotExits = _object_spread({}, self.notExistVal);
        self.valMap = {};
        self.notExistVal = {};
        _checked.forEach(function(item) {
            var strItem = String(item);
            var c = self.optMap[strItem];
            if (c) {
                self.valMap[strItem] = {
                    v: item,
                    o: self.optMap[strItem]
                };
            } else {
                var prev = prevNotExits[strItem];
                self.notExistVal[strItem] = {
                    used: prev ? prev.used : false,
                    v: item
                };
            }
        });
        // 通知选中但不存在的选项到notExistValueTrigger
        if (notExistValueTrigger) {
            var notOptionValues = [];
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(self.notExistVal).forEach(function(param) {
                var _param = _sliced_to_array(param, 2), _ = _param[0], v = _param[1];
                if (!v.used) {
                    v.used = true;
                    notOptionValues.push(v.v);
                }
            });
            notOptionValues.length && notExistValueTrigger(notOptionValues);
        }
    };
    var _options = conf.options, options = _options === void 0 ? [] : _options, _disables = conf.disables, disables = _disables === void 0 ? [] : _disables, collector = conf.collector, notExistValueTrigger = conf.notExistValueTrigger;
    /* ⚠ 用最少的循环实现功能，因为option可能包含巨量的数据 */ var self = useSelf({
        /** 存放所有选项的字典 */ optMap: {},
        /** 存放所有已选值的字典 */ valMap: {},
        /** 存放checked中存在，但是options中不存在的值, used为是否已通过 */ notExistVal: {}
    });
    var triggerKey = conf.triggerKey || "onChange";
    var ref = _sliced_to_array(useFormState(_object_spread_props(_object_spread({}, conf), // 截获onChange并自定义更新逻辑
    _define_property({}, triggerKey, function(val) {
        var // valMapSync(val); 强控制时在这里同步会有问题，统一转移到effect中
        ref;
        (ref = conf[triggerKey]) === null || ref === void 0 ? void 0 : ref.call(conf, val, getCheckedOptions(val));
    })), [], conf), 2), checked = ref[0], setChecked = ref[1];
    /** 提取所有选项为基础类型值, 基础值数组操作更方便 */ var items = useMemo(function() {
        return collector ? options.map(function(item) {
            var v = collector(item);
            self.optMap[String(v)] = item;
            return collector(item);
        }) : options.map(function(item) {
            self.optMap[String(item)] = item;
            return item;
        });
    }, [
        options
    ]);
    /** 初始化触发valMap */ useMemo(function() {
        valMapSync(checked);
    }, [
        checked
    ]);
    var isChecked = useFn(function(val) {
        var v = val;
        return !!self.valMap[v] || !!self.notExistVal[v];
    });
    var isDisabled = useFn(function(val) {
        return disables.includes(val);
    });
    var check = useFn(function(val) {
        if (isDisabled(val)) return;
        if (!isChecked(val)) {
            setChecked(_to_consumable_array(checked).concat([
                val
            ]));
        }
    });
    var unCheck = useFn(function(val) {
        if (isDisabled(val)) return;
        if (!isChecked(val)) return;
        var index = checked.indexOf(val);
        if (index !== -1) {
            var temp = _to_consumable_array(checked);
            temp.splice(index, 1);
            setChecked(temp);
        }
    });
    var checkAll = useFn(function() {
        // 只选中当前包含的选项
        setChecked(getEnables());
    });
    var unCheckAll = useFn(function() {
        setChecked(getEnables(false));
    });
    var toggle = useFn(function(val) {
        if (isDisabled(val)) return;
        var _isC = isChecked(val);
        if (!_isC) {
            setChecked(_to_consumable_array(checked).concat([
                val
            ]));
        } else {
            var index = checked.indexOf(val);
            var newArray = checked.slice();
            newArray.splice(index, 1);
            setChecked(newArray);
        }
        return !_isC;
    });
    var toggleAll = useFn(function() {
        var reverse = items.filter(function(item) {
            var _isDisabled = isDisabled(item);
            var _isChecked = isChecked(item);
            if (_isDisabled) return _isChecked; // 如果禁用则返回、
            return !_isChecked;
        });
        setChecked(reverse);
    });
    var checkList = useFn(function(list) {
        if (!isArray(list)) return;
        if (!list.length) return;
        // 排除禁用项和已选中项
        var newList = list.filter(function(item) {
            if (isDisabled(item)) return false;
            if (isChecked(item)) return false; // isChecked消耗比isDisabled高，所以用`||`判断
            return true;
        });
        setChecked(function(prev) {
            return _to_consumable_array(prev).concat(_to_consumable_array(newList));
        });
    });
    var unCheckList = useFn(function(removeList) {
        if (!isArray(removeList)) return;
        if (!removeList.length) return;
        // 排除禁用项和未选中项
        var rmList = removeList.filter(function(item) {
            if (isDisabled(item)) return false;
            return isChecked(item);
        });
        setChecked(function(prev) {
            return _difference(prev, rmList);
        });
    });
    var setCheck = useFn(function(nextChecked) {
        // 只选中列表中未被禁用的项
        var extra = nextChecked.filter(function(item) {
            if (isDisabled(item)) {
                return isChecked(item);
            }
            return true;
        });
        setChecked(_to_consumable_array(extra));
    });
    var setCheckBy = useFn(function(val, _isChecked) {
        if (isDisabled(val)) return;
        _isChecked ? check(val) : unCheck(val);
    });
    /**
   * checked可以允许存在options中不存在的值， 所有选中, 局部选中都只针对传入选项来确定 */ return _object_spread_props(_object_spread({}, getCheckStatus()), {
        checked: checked,
        originalChecked: getCheckedOptions(checked),
        noneChecked: checked.length === 0,
        isChecked: isChecked,
        isDisabled: isDisabled,
        check: check,
        unCheck: unCheck,
        checkAll: checkAll,
        unCheckAll: unCheckAll,
        toggle: toggle,
        toggleAll: toggleAll,
        setChecked: setCheck,
        setCheckBy: setCheckBy,
        checkList: checkList,
        unCheckList: unCheckList
    });
}
