import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { getScrollParent, isBoolean, isDom } from "@m78/utils";
import { getRefDomOrDom, useFn } from "@m78/hooks";
import throttle from "lodash/throttle.js";
import debounce from "lodash/debounce.js";
import { _arrowSpace, _calcAlignment, _defaultAlignment, _defaultProps, _flip, _getDirections, _getMinClampBound, _preventOverflow, isBound } from "./common.js";
import { OverlayUpdateType } from "./types.js";
import { TriggerType } from "../trigger/index.js";
export function _useMethods(ctx) {
    var containerRef = ctx.containerRef, props = ctx.props, spApi = ctx.spApi, self = ctx.self, open = ctx.open, state = ctx.state, setState = ctx.setState, arrowSpApi = ctx.arrowSpApi, trigger = ctx.trigger, setOpen = ctx.setOpen;
    /** 判断当前的bound类型, 返回null表示无任何可用配置 */ function getCurrentBoundType() {
        if (self.lastXY) return OverlayUpdateType.xy;
        if (self.lastAlignment) return OverlayUpdateType.alignment;
        if (isValidTarget(self.lastTarget)) return OverlayUpdateType.target;
        return null;
    }
    /** 根据xy获取bound */ function getBoundWithXY(xy) {
        var _xy = _sliced_to_array(xy, 2), x = _xy[0], y = _xy[1];
        return {
            left: x,
            top: y,
            width: 0,
            height: 0
        };
    }
    /** 根据alignment获取bound */ function getBoundWithAlignment(alignment) {
        var _containerRef_current_getBoundingClientRect = containerRef.current.getBoundingClientRect(), width = _containerRef_current_getBoundingClientRect.width, height = _containerRef_current_getBoundingClientRect.height;
        if (state.lastDirection) {
            width = 0;
            height = 0;
        }
        var _$_calcAlignment = _sliced_to_array(_calcAlignment(alignment, [
            width,
            height
        ]), 2), x = _$_calcAlignment[0], y = _$_calcAlignment[1];
        return {
            left: x,
            top: y,
            width: 0,
            height: 0
        };
    }
    /** 根据target获取bound和el */ function getBoundWithTarget(target) {
        if (isBound(target)) return [
            target,
            null
        ];
        if (isValidTarget(target)) {
            // 上方已经过滤掉bound, 所以这里必定是dom节点
            var el = getRefDomOrDom(target) || null;
            return [
                el.getBoundingClientRect(),
                el
            ];
        }
        if (props.childrenAsTarget && trigger.el) {
            return [
                trigger.el.getBoundingClientRect(),
                trigger.el
            ];
        }
        /** target无效时居中显示 */ return [
            getBoundWithAlignment(_defaultAlignment),
            null
        ];
    }
    /** 是否是有效的target */ function isValidTarget(target) {
        if (!target) return false;
        if (isBound(target)) return true;
        var el = getRefDomOrDom(target);
        return !!isDom(el);
    }
    /**
   * 根据传入类型或当前配置获取定位bound和类型, 取值顺序为:
   * xy > alignment > target
   *
   * 如果未成功获取到, 返回null
   * */ function getBound(type) {
        var uType = type || getCurrentBoundType();
        if (uType === OverlayUpdateType.xy) return [
            getBoundWithXY(self.lastXY),
            uType,
            null
        ];
        if (uType === OverlayUpdateType.alignment) return [
            getBoundWithAlignment(self.lastAlignment),
            uType,
            null
        ];
        if (uType === OverlayUpdateType.target) {
            var _getBoundWithTarget = _sliced_to_array(getBoundWithTarget(self.lastTarget), 2), bound = _getBoundWithTarget[0], el = _getBoundWithTarget[1];
            return [
                bound,
                uType,
                el
            ];
        }
        return [
            null,
            uType,
            null
        ];
    }
    /** 获取根据方向处理后的位置信息, 此函数假设位置信息存在, 在调用前需进行断言 */ function getDirectionMeta(t) {
        var containerBound = containerRef.current.getBoundingClientRect();
        var dir = props.direction;
        var offset = props.offset + (props.arrow ? props.arrowSize[1] + _arrowSpace : 0);
        var clampBound = _getMinClampBound(state.scrollParents);
        // 获取所有位置信息
        var directions = _getDirections(t, containerBound, clampBound, offset);
        // 根据可用信息选择一个方向, 优先使用最后使用的方向防止过多的跳动
        var pickDirection = _flip(dir, directions, state.lastDirection);
        if (pickDirection.direction !== state.lastDirection) {
            setState({
                lastDirection: pickDirection.direction
            });
        }
        // 内容超出屏幕修正处理
        return _preventOverflow(pickDirection, t, containerBound, clampBound, props.arrowSize);
    }
    /** 在满足条件的情况下同步所有滚动父级 */ function syncScrollParent() {
        if (!self.lastTarget) return;
        if (!isValidTarget(self.lastTarget) || isBound(self.lastTarget)) return;
        var el = getRefDomOrDom(self.lastTarget);
        if (!el) return;
        var parents = getScrollParent(el, true, false);
        var same = true;
        var filterP = parents.filter(function(item) {
            return item !== document.documentElement && item !== document.body;
        });
        filterP.forEach(function(item, index) {
            var prev = state.scrollParents[index];
            if (item !== prev) {
                same = false;
            }
        });
        if (!same) {
            setState({
                scrollParents: filterP
            });
        }
    }
    /** 是否启用箭头 */ function isArrowEnable() {
        return props.direction && props.arrow;
    }
    /** 使用最后更新的类型或配置类型更新位置 */ var update = useFn(function(immediate) {
        if (!open) return;
        // 1. 存在最后更新类型, 直接走该类型
        // 2. 不存在最后更新类型, 使用配置自动获取的类型
        // 3. 两种方式均未获取到值, 使用默认的alignment
        var _getBound = _sliced_to_array(getBound(self.lastUpdateType), 3), bound = _getBound[0], type = _getBound[1], el = _getBound[2];
        // target不同时重新获取父级
        if (el && self.lastSyncScrollElement !== el) {
            self.lastSyncScrollElement = el;
            syncScrollParent();
        }
        if (type) {
            self.lastUpdateType = type;
        }
        var tBound = bound || getBoundWithAlignment(_defaultAlignment);
        var isHidden = false;
        // 含位置配置时, 根据位置进行修正
        if (props.direction) {
            var _getDirectionMeta = _sliced_to_array(getDirectionMeta(tBound), 3), directionBound = _getDirectionMeta[0], arrowOffset = _getDirectionMeta[1], hide = _getDirectionMeta[2];
            isHidden = hide;
            if (isArrowEnable()) {
                arrowSpApi.start({
                    offset: arrowOffset,
                    immediate: true
                });
            }
            tBound = _object_spread_props(_object_spread({}, tBound), {
                left: directionBound.left,
                top: directionBound.top
            });
        }
        self.lastPosition = [
            tBound.left,
            tBound.top
        ];
        spApi.start({
            to: {
                x: tBound.left,
                y: tBound.top,
                isHidden: isHidden
            },
            immediate: immediate
        });
    });
    /** 根据传入的xy来更新位置 */ var updateXY = useFn(function(xy, immediate) {
        self.lastUpdateType = OverlayUpdateType.xy;
        self.lastXY = xy;
        update(immediate);
    });
    /** 根据传入的alignment来更新位置 */ var updateAlignment = useFn(function(alignment, immediate) {
        self.lastUpdateType = OverlayUpdateType.alignment;
        self.lastAlignment = alignment;
        update(immediate);
    });
    /** 根据传入的target来更新位置 */ var updateTarget = useFn(function(target, immediate) {
        var notPrev = !self.lastTarget;
        self.lastUpdateType = OverlayUpdateType.target;
        self.lastTarget = target;
        update(isBoolean(immediate) ? immediate : notPrev);
    });
    /** 从children获取的dom来更新target */ var updateChildrenEl = useFn(function() {
        if (props.childrenAsTarget && trigger.el) {
            updateTarget(trigger.el);
        }
    });
    /** 内容区域活动时触发(鼠标移入 ) */ var activeContent = useFn(function() {
        clearTimeout(self.shouldCloseTimer);
        self.activeContent = true;
    });
    /** 内容区域失活时触发 */ var unActiveContent = useFn(function() {
        self.activeContent = false;
        // 有shouldCloseFlag标记并且不处于活动状态时关闭
        if (self.shouldCloseFlag && !self.currentActiveStatus) {
            self.shouldCloseTimer = setTimeout(function() {
                if (!self.currentActiveStatus && !ctx.isUnmount()) {
                    setOpen(false);
                }
            }, 260);
        }
    });
    /** 防止高频调用的update */ var throttleUpdate = useFn(function() {
        return update(true);
    }, function(fn) {
        return throttle(fn, 5, {
            trailing: true
        });
    });
    /** 防止高频调用的update */ var debounceUpdate = useFn(function() {
        return update();
    }, function(fn) {
        return debounce(fn, 500);
    });
    // 多触发点的特殊handle
    var onTriggerMultiple = useFn(function(e) {
        clearTimeout(self.triggerMultipleTimer);
        if (e.type === TriggerType.move) {
            ctx.triggerHandle(e);
            return;
        }
        var isOpen = true;
        if (e.type === TriggerType.click) {
            isOpen = !open;
        }
        if (e.type === TriggerType.focus || e.type === TriggerType.active) {
            isOpen = e.type === TriggerType.focus ? e.focus : e.active;
        }
        if (e.type === TriggerType.contextMenu) {
            isOpen = true;
        }
        if (isOpen) {
            self.lastTriggerTarget = e.data;
            // 需要在clickAway之后出发
            self.triggerMultipleTimer = setTimeout(function() {
                updateTarget(e.target, true);
                ctx.triggerHandle(e);
            }, 10);
        } else if (self.lastTriggerTarget === e.data) {
            self.lastTriggerTarget = undefined;
            ctx.triggerHandle(e);
        }
    });
    /** 拖动处理 */ var onDragHandle = useFn(function(e) {
        if (props.direction) {
            console.warn("".concat(_defaultProps.namespace, ": direction and drag can't be used at the same time"));
            return;
        }
        updateXY(e.offset, true);
    });
    /** 获取拖动的初始坐标 */ var getDragInitXY = useFn(function() {
        if (!self.lastPosition) return [
            0,
            0
        ];
        return self.lastPosition;
    });
    /** 获取拖动的限制边界 */ var getDragBound = useFn(function() {
        var _containerRef_current;
        // 拖动时containerRef必然已挂载
        var bound = (_containerRef_current = containerRef.current) === null || _containerRef_current === void 0 ? void 0 : _containerRef_current.getBoundingClientRect();
        return {
            left: 0,
            top: 0,
            right: window.innerWidth - bound.width,
            bottom: window.innerHeight - bound.height
        };
    });
    return {
        getBoundWithXY: getBoundWithXY,
        getBoundWithAlignment: getBoundWithAlignment,
        getBoundWithTarget: getBoundWithTarget,
        getBound: getBound,
        activeContent: activeContent,
        unActiveContent: unActiveContent,
        updateChildrenEl: updateChildrenEl,
        isArrowEnable: isArrowEnable,
        updateXY: updateXY,
        updateAlignment: updateAlignment,
        updateTarget: updateTarget,
        update: update,
        throttleUpdate: throttleUpdate,
        debounceUpdate: debounceUpdate,
        onTriggerMultiple: onTriggerMultiple,
        onDragHandle: onDragHandle,
        getDragInitXY: getDragInitXY,
        getDragBound: getDragBound
    };
}
