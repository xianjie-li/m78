import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { raf } from "@m78/utils";
/**
 * 接收每次x/y轴的偏移, 根据触发的区间进行补帧后平滑的触发trigger, 使用者可在trigger事件中更新实际的位置
 * */ export var SmoothTrigger = /*#__PURE__*/ function() {
    "use strict";
    function SmoothTrigger(opt) {
        _class_call_check(this, SmoothTrigger);
        _define_property(this, "opt", void 0);
        // 待移动的y轴位置
        _define_property(this, "yAll", void 0);
        // 待移动的x轴位置
        _define_property(this, "xAll", void 0);
        _define_property(this, "running", void 0);
        // 当前raf清理函数
        _define_property(this, "rafClear", void 0);
        this.opt = opt;
        this.yAll = 0;
        this.xAll = 0;
        this.running = false;
    }
    _create_class(SmoothTrigger, [
        {
            key: "trigger",
            value: function trigger(param) {
                var deltaX = param.deltaX, deltaY = param.deltaY;
                if (!deltaX && !deltaY) return;
                this.yAll += deltaY;
                this.xAll += deltaX;
                // 切换滚动方向时, 将值尽快重置到对应方向, 防止粘滞感
                if (deltaY > 0) {
                    if (this.yAll < 0) this.yAll = 0;
                } else if (deltaY < 0) {
                    if (this.yAll > 0) this.yAll = 0;
                }
                if (deltaX > 0) {
                    if (this.xAll < 0) this.xAll = 0;
                } else if (deltaX < 0) {
                    if (this.xAll > 0) this.xAll = 0;
                }
                if (!this.running && (this.xAll || this.yAll)) {
                    this.running = true;
                    this.run();
                }
            }
        },
        {
            key: "destroy",
            value: function destroy() {
                if (this.rafClear) this.rafClear();
            }
        },
        {
            key: "run",
            value: /** 根据当前的xAll/yAll开始触发滚动 */ function run() {
                var _this = this;
                var _this_rafClear, _this1;
                (_this_rafClear = (_this1 = this).rafClear) === null || _this_rafClear === void 0 ? void 0 : _this_rafClear.call(_this1);
                this.rafClear = raf(function() {
                    var y = _this.movementCalc(true);
                    var x = _this.movementCalc(false);
                    if (x || y) {
                        _this.opt.trigger({
                            x: x,
                            y: y
                        });
                    }
                    _this.rafClear = undefined;
                    if (_this.xAll || _this.yAll) {
                        _this.run();
                    } else {
                        _this.running = false;
                    }
                });
            }
        },
        {
            key: "movementCalc",
            value: /** 移动距离计算 */ function movementCalc(isY) {
                var all = isY ? this.yAll : this.xAll;
                if (all !== 0) {
                    var move = 0;
                    var distance = Math.max(Math.abs(all) * SmoothTrigger.DECLINE_RATE, 1);
                    if (all > 0) {
                        all -= distance;
                        move = distance;
                        // 对应方向无值时重置
                        if (all < 0) {
                            move -= all;
                            all = 0;
                        }
                    }
                    if (all < 0) {
                        all += distance;
                        move = -distance;
                        if (all > 0) {
                            move += all;
                            all = 0;
                        }
                    }
                    isY ? this.yAll = all : this.xAll = all;
                    return move;
                }
                return 0;
            }
        }
    ]);
    return SmoothTrigger;
}();
// 滚动距离递减率, 越大滚动越快
_define_property(SmoothTrigger, "DECLINE_RATE", 0.16);
