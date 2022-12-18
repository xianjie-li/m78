import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { createEvent, useDelayToggle } from "@m78/hooks";
import { useEffect, useMemo, useRef } from "react";
import { config } from "react-spring";
import { _notify } from "./notify.js";
/**
 * 一个事件, 用于实现interactive, pos表示触发事件的notify类型, isIn表示是开始触发还是结束触发
 * */ export var _interactiveEvent = createEvent();
/** 初始动画值 */ export var _initTransition = {
    height: 0,
    process: 100,
    opacity: 0,
    transform: "scale3d(0.7, 0.7, 0.7)",
    config: config.stiff
};
/**
 * 添加交互行为, 在聚焦时防止带延迟的同位置notify隐藏
 * */ export function _useInteractive(share) {
    var start = /** 开始动画 */ function start() {
        if (!hasDuration || !open) return;
        _interactiveEvent.emit(position, true);
    };
    var stop = /** 暂停动画 */ function stop() {
        if (!hasDuration || !open) return;
        _interactiveEvent.emit(position, false);
    };
    var position = share.position, open = share.open, hasDuration = share.hasDuration, api = share.api;
    var interactiveFlag = useRef();
    /** 发生交互时, 暂停所有同方向的notify */ _interactiveEvent.useEvent(function(pos, isIn) {
        if (!hasDuration || pos !== position || !open) return;
        clearTimeout(interactiveFlag.current);
        if (isIn) {
            // 是否包含为完全显示的notify
            var notShow = api.current.map(function(item) {
                return item.get().opacity;
            }).filter(function(num) {
                return num < 1;
            });
            !notShow.length && api.pause();
        } else {
            interactiveFlag.current = setTimeout(api.resume, 300);
        }
    });
    return {
        start: start,
        stop: stop
    };
}
/**
 * 根据是否开启了关闭按钮动态设置偏移和边距, 防止关闭按钮遮挡文字
 * */ export function _useFixPad(param) {
    var props = param.props, bound = param.bound;
    var title = props.title, cancel = props.cancel;
    return useMemo(function() {
        var ob = {
            paddingRight: "18px"
        };
        /* 按钮偏移调整, 用于优化显示效果, 小于50视为单行 */ var iconOb = bound.offsetHeight < 50 ? {
            top: "10px"
        } : undefined;
        var contOb = title ? undefined : ob;
        return [
            {
                title: ob,
                cont: cancel ? contOb : undefined
            },
            iconOb, 
        ];
    }, [
        cancel,
        title,
        bound.height
    ]);
}
/**
 *
 * */ export function _useToggleController(share) {
    var showHandle = /**
   * 控制显示动画对应行为
   * */ function showHandle() {
        api.start({
            to: function() {
                var _ref = _async_to_generator(function(next) {
                    var _tmp, _tmp1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _tmp = {};
                                return [
                                    4,
                                    next((_tmp.height = bound.offsetHeight + 16 /* 上下边距 */ , _tmp.process = 100, _tmp.opacity = 1, _tmp.transform = "scale3d(1, 1, 1)", _tmp))
                                ];
                            case 1:
                                _state.sent();
                                if (!hasDuration) return [
                                    3,
                                    3
                                ];
                                _tmp1 = {};
                                return [
                                    4,
                                    next((_tmp1.process = 0, _tmp1.config = {
                                        duration: duration
                                    }, _tmp1))
                                ];
                            case 2:
                                _state.sent();
                                props.onChange(false);
                                _state.label = 3;
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                });
                return function(next) {
                    return _ref.apply(this, arguments);
                };
            }()
        });
    };
    var hideHandle = /**
   * 控制隐藏动画和销毁
   * */ function hideHandle() {
        api.start(_object_spread_props(_object_spread({}, _initTransition), {
            onRest: props.onDispose
        }));
    };
    var open = share.open, props = share.props, bound = share.bound, api = share.api, hasDuration = share.hasDuration, duration = share.duration;
    var dShow = useDelayToggle(open, props.minDuration);
    useEffect(function() {
        if (dShow) {
            showHandle();
        } else {
            hideHandle();
        }
    }, [
        dShow,
        bound.height
    ]);
    return dShow;
}
export function _notifyQuickerBuilder(status) {
    return function(content, position) {
        return _notify.render({
            content: content,
            position: position,
            status: status
        });
    };
}
