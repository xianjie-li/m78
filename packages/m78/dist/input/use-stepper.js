import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "../button/index.js";
import { Size } from "../common/index.js";
import { IconRemove } from "@m78/icons/icon-remove.js";
import { IconAdd } from "@m78/icons/icon-add.js";
import React from "react";
import { useDrag } from "@use-gesture/react";
import { isBoolean } from "@m78/utils";
import { useFn, useSelf, useDestroy } from "@m78/hooks";
var LONG_PRESS_TRIGGER_DELAY = 800;
export function _useStepper(ctx) {
    var props = ctx.props;
    var ins = useSelf({
        /** 长按自增/减计时器 */ stepperTimer: null
    });
    useDestroy(function() {
        clearTimeout(ins.stepperTimer);
    });
    var handleCreate = function(isInc) {
        return function(param) {
            var first = param.first, down = param.down, memo = param.memo;
            if (first && down) {
                auto(isInc);
                return true;
            }
            if (!down && memo) {
                clearTimeout(ins.stepperTimer);
            }
        };
    };
    var incBind = useDrag(handleCreate(false), {
        delay: LONG_PRESS_TRIGGER_DELAY
    });
    var subBind = useDrag(handleCreate(true), {
        delay: LONG_PRESS_TRIGGER_DELAY
    });
    /** 步进操作 */ var stepHandle = useFn(function(isInc) {
        if (!props.stepper) return;
        var stepNum = isBoolean(props.stepper) ? 1 : props.stepper;
        var num = Number(ctx.value);
        if (isNaN(num)) {
            console.warn("Invalid value entered, operation ignored");
            return;
        }
        ctx.manualChange(String(isInc ? num + stepNum : num - stepNum));
    });
    function auto(inc) {
        clearTimeout(ins.stepperTimer);
        ins.stepperTimer = setTimeout(function() {
            stepHandle(inc);
            auto(inc);
        }, 80);
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: "m78-input_icon m78-input_num-ctrl",
        children: [
            /*#__PURE__*/ _jsx(Button, _object_spread_props(_object_spread({
                squareIcon: true,
                size: Size.small,
                disabled: ctx.isDisabled,
                onClick: function() {
                    return stepHandle(false);
                }
            }, incBind()), {
                children: /*#__PURE__*/ _jsx(IconRemove, {})
            })),
            /*#__PURE__*/ _jsx(Button, _object_spread_props(_object_spread({
                squareIcon: true,
                size: Size.small,
                disabled: ctx.isDisabled,
                onClick: function() {
                    return stepHandle(true);
                }
            }, subBind()), {
                children: /*#__PURE__*/ _jsx(IconAdd, {})
            }))
        ]
    });
}
