import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { ensureArray, isBoolean, isFunction } from "@m78/utils";
import { _isBound } from "./methods.js";
import { _defaultLevel, _defaultOverrideStrategy, _defaultCursorConf } from "./common.js";
import { TriggerOverrideStrategy } from "./types.js";
/** 事件对象更新和获取 */ export function _checkGetter(ctx) {
    // 将从dom读取的bound进行缓存, 防止频繁读取, 并没隔一段时间清理一次
    var domBoundCacheMap = new Map();
    var t = setInterval(function() {
        domBoundCacheMap.clear();
    }, 500);
    ctx.trigger.getTargetByXY = function(args) {
        return ctx.getEventList(args).eventList;
    };
    /** 获取选项和选项数据列表 */ ctx.getEventList = function getEventList(args) {
        var xy = args.xy, type = args.type, filter = args.filter, dom = args.dom, key = args.key, looseXYCheck = args.looseXYCheck;
        var list = [];
        var optList = [];
        var eventList = [];
        var checkTypeList = ensureArray(type);
        var itemHandle = function(option) {
            var eType = getTypeMap(option);
            // 需要过滤类型
            if (checkTypeList.length) {
                var has = false;
                for(var i = 0; i < checkTypeList.length; i++){
                    if (eType.get(checkTypeList[i])) {
                        has = true;
                        break;
                    }
                }
                if (!has) return;
            }
            var data = getDataByOption(option, eType);
            var optEnable = data.option.enable;
            if (isBoolean(optEnable) && !optEnable) return;
            if (isFunction(optEnable) && optEnable(data) === false) return;
            if (filter && filter(data) === false) return;
            optList.push(option);
            list.push(data);
            var inBound = false;
            var isPass = false;
            if (xy && inBoundCheck(xy[0], xy[1], data.bound)) {
                inBound = true;
            }
            // 当前事件选项target是真实dom, 检测触发位置是否在dom内
            if (dom && !data.isVirtual) {
                if (looseXYCheck || !xy || xy && inBound) {
                    // 复用isBound检测可减少 contains 的直接调用
                    isPass = data.dom.contains(dom);
                }
            } else if (inBound) {
                isPass = true;
            }
            if (isPass) {
                eventList.push(data);
            }
        };
        if (key) {
            // 获取指定组
            getGroupMap(key).forEach(function(item) {
                itemHandle(item);
            });
        } else {
            // 获取全部
            for(var i = 0; i < ctx.optionList.length; i++){
                var item = ctx.optionList[i];
                itemHandle(item);
            }
        }
        if (!xy) {
            eventList = list.slice();
        }
        // 处理冲突事件
        if (eventList.length) {
            var maxLevel = 0;
            var _list = [];
            // 找出最大level的所有data
            eventList.forEach(function(i) {
                var level = i.option.level || _defaultLevel;
                if (level === maxLevel) {
                    _list.push(i);
                } else if (level > maxLevel) {
                    _list.length = 0;
                    _list.push(i);
                    maxLevel = level;
                }
            });
            // 若包含多个事件, 使用策略进行过滤
            if (_list.length > 1) {
                var finalList = [];
                _list.forEach(function(i, ind) {
                    var _i_option_overrideStrategy;
                    var strategy = (_i_option_overrideStrategy = i.option.overrideStrategy) !== null && _i_option_overrideStrategy !== void 0 ? _i_option_overrideStrategy : _defaultOverrideStrategy;
                    // 已经是最后一项, 且仍没有事件被持有
                    if (ind === _list.length - 1 && !finalList.length) {
                        finalList.push(i);
                        return;
                    }
                    // 并行项
                    if (strategy === TriggerOverrideStrategy.parallel) {
                        finalList.push(i);
                        return;
                    }
                    // 独占项
                    if (strategy === TriggerOverrideStrategy.possess) {
                        finalList.push(i);
                        return;
                    }
                // transfer
                });
                eventList = finalList;
            } else {
                eventList = _list;
            }
        }
        return {
            list: list,
            optList: optList,
            eventList: eventList
        };
    };
    ctx.updateTargetData = function(data) {
        return getDataByOption(data.option, data.typeMap);
    };
    ctx.getDataByOption = getDataByOption;
    /** 从 TriggerOption 获取 typeMap */ function getTypeMap(opt) {
        var typeArr = ensureArray(opt.type);
        if (!typeArr.length) return new Map();
        var m = new Map();
        typeArr.forEach(function(i) {
            return m.set(i, true);
        });
        return m;
    }
    function clearCache() {
        clearInterval(t);
        domBoundCacheMap.clear();
    }
    /** 从 TriggerOption 获取 _TriggerTargetData */ function getDataByOption(opt, typeMap) {
        var cursor = _object_spread({}, _defaultCursorConf, opt.cursor);
        if (!typeMap) {
            typeMap = getTypeMap(opt);
        }
        if (_isBound(opt.target)) {
            return {
                isVirtual: true,
                bound: opt.target,
                dom: null,
                option: opt,
                cursor: cursor,
                typeMap: typeMap
            };
        } else {
            var rect = domBoundCacheMap.get(opt.target);
            if (!rect) {
                rect = opt.target.getBoundingClientRect();
                domBoundCacheMap.set(opt.target, rect);
            }
            return {
                isVirtual: false,
                bound: {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                },
                dom: opt.target,
                option: opt,
                cursor: cursor,
                typeMap: typeMap
            };
        }
    }
    /** 检测xy是否在指定bound内 */ function inBoundCheck(x, y, bound) {
        var left = bound.left, top = bound.top, width = bound.width, height = bound.height;
        return x >= left && x <= left + width && y >= top && y <= top + height;
    }
    /** 获取指定key的事件配置组 */ function getGroupMap(key) {
        var map = ctx.optionMap.get(key);
        if (_instanceof(map, Map)) return map;
        return new Map();
    }
    return {
        clearCache: clearCache
    };
}
