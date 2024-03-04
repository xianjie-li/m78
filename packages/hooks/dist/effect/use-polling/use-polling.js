/** 配置参数 */ import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { useFn } from "../use-fn/use-fn.js";
import { useEffect, useMemo } from "react";
import { useSelf } from "../../state/use-self/use-self.js";
/** 创建轮询任务 */ export function usePolling(option) {
    var _option_enable = option.enable, enable = _option_enable === void 0 ? true : _option_enable;
    var self = useSelf({
        /** 内部的计时间隔, 由growRatio等配置动态调整 */ internalInterval: option.interval,
        /** 计时器标识 */ timer: null,
        /** 轮询次数, 以每次enable为true开始计数 */ count: 0
    });
    /** 放在useFn中, 保证每次调用trigger都是最新的 */ var cb = useFn(/*#__PURE__*/ _async_to_generator(function() {
        var e;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    self.count += 1;
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        option.trigger()
                    ];
                case 2:
                    _state.sent();
                    return [
                        3,
                        4
                    ];
                case 3:
                    e = _state.sent();
                    console.log(e);
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    }));
    useMemo(function() {
        // 若变更则实时设置
        self.internalInterval = option.interval;
    }, [
        option.interval
    ]);
    var polling = useFn(function() {
        var _ref = _async_to_generator(function(init) {
            var growRatio, growMaxInterval;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (option.maxPollingNumber && self.count >= option.maxPollingNumber) {
                            return [
                                2
                            ];
                        }
                        if (!(option.initTrigger && init)) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            cb()
                        ];
                    case 1:
                        _state.sent();
                        _state.label = 2;
                    case 2:
                        // 保留当次调用的配置快照, 防止变更
                        growRatio = option.growRatio, growMaxInterval = option.growMaxInterval;
                        self.timer = setTimeout(/*#__PURE__*/ _async_to_generator(function() {
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        _state.trys.push([
                                            0,
                                            ,
                                            2,
                                            3
                                        ]);
                                        return [
                                            4,
                                            cb()
                                        ];
                                    case 1:
                                        _state.sent();
                                        return [
                                            3,
                                            3
                                        ];
                                    case 2:
                                        if (growRatio) {
                                            self.internalInterval *= growRatio;
                                            if (growMaxInterval) {
                                                self.internalInterval = Math.min(self.internalInterval, growMaxInterval);
                                            }
                                        }
                                        polling();
                                        return [
                                            7
                                        ];
                                    case 3:
                                        return [
                                            2
                                        ];
                                }
                            });
                        }), self.internalInterval);
                        return [
                            2
                        ];
                }
            });
        });
        return function(init) {
            return _ref.apply(this, arguments);
        };
    }());
    useEffect(function() {
        if (enable) {
            polling(true);
        }
        return function() {
            clearTimeout(self.timer);
        };
    }, [
        enable
    ]);
    return {
        /** 清理并重置当前的各种计数值, 然后重新开始轮询 */ reset: function() {
            clearTimeout(self.timer);
            self.count = 0;
            self.internalInterval = option.interval;
            polling(true);
        }
    };
}
