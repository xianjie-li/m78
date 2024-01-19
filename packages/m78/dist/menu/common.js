import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { getChildrenByDataSource, getValueByDataSource } from "../common/index.js";
/** 获取树列表及其所有子项的value */ export function _getOptionAllValues(options, cus) {
    var res = [];
    options.forEach(function(item) {
        var val = getValueByDataSource(item, cus);
        if (val !== null) {
            res.push(val);
        }
        var children = getChildrenByDataSource(item, cus);
        if (children.length) {
            var _res;
            (_res = res).push.apply(_res, _to_consumable_array(_getOptionAllValues(children, cus)));
        }
    });
    return res;
}
/**
 * 铺平选项并生成易于查询的结构
 * */ export function _flatOptions(options, cus) {
    var map = {};
    var getNextValid = function(list, ind) {
        for(var i = ind; i < list.length; i++){
            var cur = list[i];
            var val = getValueByDataSource(cur, cus);
            if (val !== null && !cur.disabled) return cur;
        }
    };
    var getPrevValid = function(list, ind) {
        for(var i = ind; i >= 0; i--){
            var cur = list[i];
            var val = getValueByDataSource(cur, cus);
            if (val !== null && !cur.disabled) return cur;
        }
    };
    function flat(list, parent) {
        list.forEach(function(i, ind) {
            var _i_children, _i_children1;
            var value = getValueByDataSource(i);
            map[value] = {
                parent: parent,
                child: (_i_children = i.children) === null || _i_children === void 0 ? void 0 : _i_children[0],
                next: getNextValid(list, ind + 1) || getNextValid(list, 0),
                prev: getPrevValid(list, ind - 1) || getPrevValid(list, list.length - 1),
                siblings: list,
                value: value,
                option: i
            };
            if ((_i_children1 = i.children) === null || _i_children1 === void 0 ? void 0 : _i_children1.length) {
                flat(i.children, i);
            }
        });
    }
    flat(options);
    return map;
}
