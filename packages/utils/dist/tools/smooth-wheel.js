import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { SmoothTrigger } from "./smooth-trigger.js";
/**
 * 提供平滑处理的 onwheel 事件, 在鼠标/触控板等方式触发wheel时均能增强滚动体验
 * */ export var SmoothWheel = /*#__PURE__*/ function() {
    "use strict";
    function SmoothWheel(opt) {
        var _this = this;
        _class_call_check(this, SmoothWheel);
        _define_property(this, "opt", void 0);
        /** 平滑触发器 */ _define_property(this, "st", void 0);
        _define_property(this, "handle", void 0);
        this.opt = opt;
        this.handle = function(e) {
            e.preventDefault();
            // 按下shiftKey时, 横向滚动
            var shiftKey = e.shiftKey;
            var deltaY = shiftKey ? 0 : e.deltaY;
            var deltaX = shiftKey ? e.deltaY || e.deltaX : e.deltaX; // 部分设备按下shiftKey不会自动切换到deltaY
            _this.st.trigger({
                deltaY: deltaY,
                deltaX: deltaX
            });
        };
        this.st = new SmoothTrigger({
            trigger: opt.trigger
        });
        opt.el.addEventListener("wheel", this.handle);
    }
    _create_class(SmoothWheel, [
        {
            key: "destroy",
            value: function destroy() {
                this.opt.el.removeEventListener("wheel", this.handle);
            }
        },
        {
            key: "wheeling",
            get: // 正在滚动中
            function get() {
                return this.st.running;
            }
        }
    ]);
    return SmoothWheel;
}();
