import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { createRandString, isArray, isNumber } from "@m78/utils";
import { useFn, useSelf, useSetState, useUpdate } from "../../index.js";
import _differenceBy from "lodash/differenceBy.js";
import { useEffect } from "react";
/*
 * old[] <->  current  <-> list[]
 * */ function useQueue() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, defaultItemOption = _ref.defaultItemOption, _ref_list = _ref.list, list = _ref_list === void 0 ? [] : _ref_list, _ref_defaultManual = _ref.defaultManual, defaultManual = _ref_defaultManual === void 0 ? false : _ref_defaultManual, onChange = _ref.onChange;
    var self = useSelf({
        /** 消息队列 */ list: [],
        /** 历史记录 */ oldList: [],
        /** 开启下一条的计时器 */ timer: null,
        /** 设置计时器的时间 */ timerSetTime: null,
        /** 暂停的时间 */ pauseTime: null
    });
    var _useSetState = _sliced_to_array(useSetState({
        /** 当前显示消息 */ current: null,
        /** 是否暂停 */ manual: defaultManual
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    var update = useUpdate();
    // 清理
    useEffect(function() {
        return clearTimer;
    }, []);
    /**
   * next()的实现版本，支持参数
   * */ var nextIn = useFn(function(isPrev) {
        clearTimer();
        var nextCurrent = self.list[0] || null;
        // 将当前项添加到历史
        if (!isPrev && state.current) {
            self.oldList.push(state.current);
        }
        if (!nextCurrent) {
            setState({
                current: null
            });
            return;
        }
        // 移除新项
        self.list.splice(0, 1);
        // self.oldList.push(...del);
        setState({
            current: nextCurrent
        });
        onChange === null || onChange === void 0 ? void 0 : onChange(nextCurrent);
        // 未暂停且配置了持续时间, 定时切换到下一条
        if (isNumber(nextCurrent.duration) && !state.manual) {
            self.timer = setTimeout(nextIn, nextCurrent.duration);
            self.timerSetTime = Date.now();
        }
        // 如果切换过，暂停时间就没意义了，将其清除
        self.pauseTime = null;
    });
    /**
   * 切换到下一项
   * */ var next = useFn(function() {
        return nextIn();
    });
    /**
   * 切换到上一项
   * */ var prev = useFn(function() {
        var _self_list;
        var lastOldInd = self.oldList.length - 1; // 最后一条是当前消息
        var old = self.oldList.splice(lastOldInd, 1);
        if (!old.length) return;
        // 当前消息和上一条消息重新放回队列
        state.current && self.list.unshift(state.current);
        (_self_list = self.list).unshift.apply(_self_list, _to_consumable_array(old));
        nextIn(true);
    });
    /**
   * 推入一个或一组新项，如果当前没有选中项且非手动模式，自动执行next()
   * @param opt - 要添加的新项，可以是一个单独的项配置或配置数组
   * */ var push = useFn(function(opt) {
        if (isArray(opt)) {
            var _self_list;
            var ls = opt.map(function(item) {
                return _object_spread(_object_spread_props(_object_spread({}, defaultItemOption), {
                    id: createRandString()
                }), item);
            });
            (_self_list = self.list).push.apply(_self_list, _to_consumable_array(ls));
        } else {
            self.list.push(_object_spread(_object_spread_props(_object_spread({}, defaultItemOption), {
                id: createRandString()
            }), opt));
        }
        if (state.current || state.manual) update();
        else next();
    });
    /**
   * 跳转到指定id项，该项左侧所有项会被移到历史列表，右侧所有项会移到待执行列表
   * */ var jump = useFn(function(id) {
        clearTimer();
        var all = getAllList();
        var cInd = findIndexById(id);
        var leftList = all.slice(0, cInd);
        var rightList = all.slice(cInd);
        self.oldList = leftList;
        self.list = rightList;
        setState({
            current: null
        });
        nextIn();
    });
    /** 完全移除指定id或一组id的项, 如果你要关闭当前消息，应当使用next而不是remove，因为此方法会破坏队列的完整性 */ var remove = useFn(function(id) {
        var ids = isArray(id) ? id : [
            id
        ];
        if (!ids.length) return;
        var diffList = function(ls) {
            return _differenceBy(ls, ids.map(function(item) {
                return {
                    id: item
                };
            }), function(item) {
                return item.id;
            });
        };
        self.oldList = diffList(self.oldList);
        self.list = diffList(self.list);
        if (state.current && ids.includes(state.current.id)) {
            setState({
                current: null
            });
        } else {
            update();
        }
    });
    // 启动初始list
    useEffect(function() {
        if (list.length) {
            push(list); // +执行next()
        }
    }, []);
    /**
   * 清空队列
   * */ var clear = useFn(function() {
        self.list = [];
        self.oldList = [];
        self.timer = null;
        self.timerSetTime = null;
        self.pauseTime = null;
        clearTimer();
        setState({
            current: null,
            manual: false
        });
    });
    /**
   * 从自动模式切换为启用手动模式，暂停所有计时器
   * */ var manual = useFn(function() {
        if (state.manual) return;
        setState({
            manual: true
        });
        clearTimeout(self.timer);
        self.pauseTime = Date.now();
    });
    /**
   * 从手动模式切换为自动模式, 如果包含暂停的计时器，会从暂停位置重新开始
   * */ var auto = useFn(function() {
        if (!state.manual) return;
        setState({
            manual: false
        });
        var c = state.current;
        // 如果当前有选中项，且包含计时器, 根据打断时间重新设置计时器
        if (c) {
            clearTimeout(self.timer);
            // 包含必要参数，还原暂停时间
            if (self.pauseTime && self.timerSetTime) {
                var spend = self.pauseTime - self.timerSetTime;
                if (isNumber(c.duration) && isNumber(spend)) {
                    self.timer = setTimeout(next, c.duration - spend);
                }
            // 使用默认时间
            } else if (isNumber(c.duration)) {
                self.timer = setTimeout(next, c.duration);
            }
        } else {
            // 没有消息时重新启用队列
            next();
        }
        self.pauseTime = null;
    });
    /**
   * 指定id是否包含下一项, 不传id查当前项
   * */ function hasNext(id) {
        var _state_current;
        if (!id && !state.current) {
            return !!self.list.length;
        }
        var _id = id || ((_state_current = state.current) === null || _state_current === void 0 ? void 0 : _state_current.id);
        if (!_id) return false;
        var all = getAllList();
        var ind = findIndexById(_id);
        return !!all[ind + 1];
    }
    /**
   * 指定id是否包含上一项, 不传id查当前项
   * */ function hasPrev(id) {
        var _id = id;
        if (!_id && !state.current) return false;
        if (!_id) {
            var _state_current;
            _id = (_state_current = state.current) === null || _state_current === void 0 ? void 0 : _state_current.id;
        }
        var all = getAllList();
        var ind = findIndexById(_id);
        return !!all[ind - 1];
    }
    /**
   * 查询指定id在列表中的索引
   * */ function findIndexById(id) {
        var all = getAllList();
        return all.findIndex(function(item) {
            return item.id === id;
        });
    }
    /**
   * 获取所有列表和当前项组成的数组, 历史和当前列表
   * */ function getAllList() {
        var _ls, _ls1;
        var ls = [];
        (_ls = ls).push.apply(_ls, _to_consumable_array(self.oldList));
        if (state.current) {
            ls.push(state.current);
        }
        (_ls1 = ls).push.apply(_ls1, _to_consumable_array(self.list));
        return ls;
    }
    function clearTimer() {
        if (self.timer) {
            clearTimeout(self.timer);
            self.timerSetTime = null;
        }
    }
    return {
        push: push,
        prev: prev,
        next: next,
        jump: jump,
        hasNext: hasNext,
        hasPrev: hasPrev,
        clear: clear,
        findIndexById: findIndexById,
        isManual: state.manual,
        current: state.current,
        auto: auto,
        manual: manual,
        list: getAllList(),
        leftList: self.oldList,
        rightList: self.list,
        index: state.current ? findIndexById(state.current.id) : null,
        remove: remove
    };
}
export { useQueue };
