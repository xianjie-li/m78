import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { config } from "react-spring";
import { _TransitionBase as TransitionBase } from "./transition-base.js";
/* !这里的类型需要与./type.ts中的TransitionTypes同步 */ var transitionConfigs = {
    fade: {
        from: {
            opacity: 0
        },
        to: {
            opacity: 1
        },
        config: _object_spread_props(_object_spread({}, config.stiff), {
            clamp: true
        }),
        skipFade: true
    },
    zoom: {
        from: {
            transform: "scale3d(0.5, 0.5, 0.5)"
        },
        to: {
            transform: "scale3d(1, 1, 1)"
        }
    },
    punch: {
        from: {
            transform: "scale3d(1.5, 1.5, 1.5)"
        },
        to: {
            transform: "scale3d(1, 1, 1)"
        }
    },
    slideLeft: {
        from: {
            transform: "translate3d(-100%, 0, 0)"
        },
        to: {
            transform: "translate3d(0%, 0, 0)"
        }
    },
    slideRight: {
        from: {
            transform: "translate3d(100%, 0, 0)"
        },
        to: {
            transform: "translate3d(0%, 0, 0)"
        }
    },
    slideTop: {
        from: {
            transform: "translate3d(0, -100%, 0)"
        },
        to: {
            transform: "translate3d(0%, 0%, 0)"
        }
    },
    slideBottom: {
        from: {
            transform: "translate3d(0, 100%, 0)"
        },
        to: {
            transform: "translate3d(0, 0%, 0)"
        }
    },
    bounce: {
        from: {
            transform: "scale3d(0, 0, 0)"
        },
        to: {
            transform: "scale3d(1, 1, 1)"
        },
        config: _object_spread({}, config.wobbly)
    }
};
export var _Transition = function(_param) {
    var type = _param.type, _alpha = _param.alpha, alpha = _alpha === void 0 ? true : _alpha, props = _object_without_properties(_param, [
        "type",
        "alpha"
    ]);
    var _type = transitionConfigs[type], from = _type.from, to = _type.to, // eslint-disable-next-line prefer-const
    interpolater = _type.interpolater, // eslint-disable-next-line prefer-const
    skipFade = _type.skipFade, // eslint-disable-next-line prefer-const
    _config = _type.config;
    /* skipFade用于内部配置, alpha配置给用户对fade进行开关 */ if (alpha && !skipFade) {
        from = _object_spread({}, from, transitionConfigs.fade.from);
        to = _object_spread({}, to, transitionConfigs.fade.to);
    }
    return /* 原样传入props，config与动画配置中的进行合并 */ /*#__PURE__*/ _jsx(TransitionBase, _object_spread_props(_object_spread({}, props), {
        // config={{ ...config, ...props.config }}
        springProps: _object_spread({
            config: _config
        }, props.springProps),
        from: from,
        to: to,
        interpolater: interpolater
    }));
};
_Transition.displayName = "Transition";
