import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useEffect, useMemo, useRef } from "react";
import { flushSync } from "react-dom";
import { isFunction } from "@m78/utils";
import { createEvent, getRefDomOrDom, useFn, useScroll, useSelf, useSetState } from "../../index.js";
import _debounce from "lodash/debounce.js";
export function useVirtualList(option) {
    var list = option.list, size = option.size, _option_overscan = option.overscan, overscan = _option_overscan === void 0 ? 1 : _option_overscan, key = option.key, _option_space = option.space, space = _option_space === void 0 ? 0 : _option_space, keepAlive = option.keepAlive, containerTarget = option.containerTarget, disabled = option.disabled, optionHeight = option.height;
    var wrapRef = useRef(null);
    // 统一通知Render更新状态
    var updateEvent = useMemo(function() {
        return createEvent();
    }, []);
    var self = useSelf({
        scrolling: false
    });
    // 格式化list为虚拟list格式，并获取计算得到的总高度, 禁用时两个值分别为[]和0
    var _useMemo = _sliced_to_array(useMemo(function() {
        var h = 0;
        if (disabled) return [
            [],
            h
        ];
        var ls = list.map(function(item, index) {
            var _size = getSize(item, index);
            h += _size;
            return {
                data: item,
                index: index,
                key: getKey(item, index),
                position: h,
                size: _size
            };
        });
        return [
            ls,
            h
        ];
    }, [
        list,
        disabled
    ]), 2), fmtList = _useMemo[0], height = _useMemo[1];
    var scroller = useScroll({
        el: containerTarget,
        throttleTime: 0,
        onScroll: handleScroll
    });
    /** 使用render组件来减少hook对消费组件的频繁更新 */ var Render = useMemo(function() {
        return function(param) {
            var children = param.children;
            var _useSetState = _sliced_to_array(useSetState({
                list: [],
                scrolling: false
            }), 2), state = _useSetState[0], setState = _useSetState[1];
            updateEvent.useEvent(setState);
            return children(state);
        };
    }, []);
    // 检测必须的dom是否存在，不存在时抛异常
    useEffect(function() {
        if (disabled) return;
        if (!getRefDomOrDom(option.wrapRef, wrapRef) || !scroller.ref.current) {
            throw Error("useVirtualList(...) -> wrap or container is not gets");
        }
    }, [
        disabled
    ]);
    // 设置容器节点为可滚动和设置滚动的首帧位置
    useEffect(function() {
        if (disabled) return;
        handleScroll(scroller.get(), true);
        scroller.ref.current && (scroller.ref.current.style.overflowY = "auto");
    }, [
        disabled,
        fmtList,
        height
    ]);
    // 通知滚动结束
    var emitScrolling = useFn(function() {
        self.scrolling = false;
        updateEvent.emit({
            scrolling: false
        });
    }, function(fn) {
        return _debounce(fn, 100);
    });
    /** 核心混动逻辑 */ function handleScroll(meta, skipScrollingEmit) {
        if (disabled) return;
        // 通知滚动开始
        if (!skipScrollingEmit && !self.scrolling) {
            self.scrolling = true;
            updateEvent.emit({
                scrolling: true
            });
        }
        !skipScrollingEmit && emitScrolling();
        // keep列表需要实时计算
        var keepAliveList = [];
        var wrapEl = getRefDomOrDom(option.wrapRef, wrapRef);
        if (!wrapEl || !meta.el) return;
        if (keepAlive) {
            keepAliveList = fmtList.filter(function(item, index) {
                return keepAlive(item.data, index);
            });
        }
        // 开始索引
        var start = 0;
        // 计算开始索引
        for(var i = 0; i < fmtList.length; i++){
            var position = fmtList[i].position;
            start = i;
            if (position > meta.y) break;
        }
        // 计算结束索引
        var contActualHeight = optionHeight || meta.el.offsetHeight;
        var contHeight = 0;
        var end = start;
        for(var i1 = 0; i1 < fmtList.length; i1++){
            if (contHeight > contActualHeight || end >= fmtList.length) break;
            contHeight += fmtList[end].size;
            end += 1;
        }
        if (overscan) {
            var _getOverscanSize = _sliced_to_array(getOverscanSize(start, end), 2), nextStart = _getOverscanSize[0], nextEnd = _getOverscanSize[1];
            start = nextStart;
            end = nextEnd;
        }
        var nextList = fmtList.slice(start, end);
        if (keepAliveList.length) {
            keepAliveList.forEach(function(item) {
                var has = nextList.find(function(it) {
                    return it.key === item.key;
                });
                if (!has) {
                    if (item.index < start) nextList.unshift(item);
                    else nextList.push(item);
                }
            });
        }
        // 顶部偏移
        var top = 0;
        for(var i2 = 0; i2 < start; i2++){
            top += fmtList[i2].size;
        }
        var h = height - top + space;
        var t = "".concat(top, "px");
        // 高度为有效数值时才设置，这样list为空时内容高度就不会为0了
        var hStr = h > space ? "".concat(h, "px") : undefined;
        // 设置wrap样式
        if (wrapEl.style.cssText !== undefined) {
            wrapEl.style.cssText = "margin-top: ".concat(t, ";height: ").concat(hStr, ";");
        } else {
            wrapEl.style.marginTop = t;
            if (hStr) wrapEl.style.height = hStr;
        }
        if (skipScrollingEmit) {
            updateEvent.emit({
                list: nextList
            });
            return;
        }
        flushSync(function() {
            updateEvent.emit({
                list: nextList
            });
        });
    }
    /** 将开始和结束索引根据overscan进行修正，参数3会返回顶部应减少的偏移 */ function getOverscanSize(start, end) {
        var nextStart = Math.max(start - overscan, 0);
        var nextEnd = Math.min(/* 索引为0时不添加 */ end + overscan /* slice是尾闭合的，所以要多取一位 */ , fmtList.length);
        return [
            nextStart,
            nextEnd
        ];
    }
    function getSize(item, index) {
        if (!isFunction(size)) return size;
        return size(item, index);
    }
    function getKey(item, index) {
        if (!isFunction(key)) return String(index);
        return key(item, index);
    }
    return {
        containerRef: scroller.ref,
        wrapRef: wrapRef,
        Render: Render
    };
}
