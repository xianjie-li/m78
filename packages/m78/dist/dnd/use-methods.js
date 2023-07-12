import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { autoScrollTrigger, checkElementVisible, getScrollParent, isDom, isFunction, isObject } from "@m78/utils";
import { useFn } from "@m78/hooks";
import throttle from "lodash/throttle.js";
import isEqual from "lodash/isEqual.js";
import { _defaultDNDEnableInfos, _defaultDNDStatus, _resetEvent, _updateEvent, _checkIfAcceptable, _filterInBoundDNDs, _getCurrentTriggerByMultipleTrigger, _isIgnoreEl, _getObjectByNewValues } from "./common.js";
import clsx from "clsx";
export function _useMethods(ctx) {
    var initFeedbackEl = /** 开始拖动时使用, 初始化self.feedbackEl以便使用 */ function initFeedbackEl() {
        updateFeedbackEl();
        if (!self.feedbackEl) return;
        self.feedbackEl.className = clsx(self.feedbackEl.className, "m78 m78-dnd_feedback");
        if (isObject(props.feedbackStyle)) {
            Object.entries(props.feedbackStyle).forEach(function(param) {
                var _param = _sliced_to_array(param, 2), key = _param[0], sty = _param[1];
                self.feedbackEl.style[key] = sty;
            });
        }
    };
    var updateFeedbackEl = /** 根据配置和环境获取self.feedback */ function updateFeedbackEl() {
        if (self.feedbackEl) return;
        // 使用定制节点
        if (props.feedback) {
            var el = props.feedback();
            if (isDom(el)) {
                self.feedbackEl = el;
            }
        }
        if (!self.feedbackEl) {
            // 使用clone节点
            var node = dragNodeRef.current;
            if (node) {
                self.feedbackEl = node.cloneNode(true);
                self.feedbackEl.style.width = "".concat(node.offsetWidth, "px");
                self.feedbackEl.style.height = "".concat(node.offsetHeight, "px");
            }
        }
        document.body.appendChild(self.feedbackEl);
    };
    var setState = ctx.setState, props = ctx.props, self = ctx.self, dragNodeRef = ctx.dragNodeRef, node = ctx.node;
    var enableDrag = props.enableDrag;
    /** 更新当前节点的位置等信息到context中 */ var updateDNDMeta = useFn(function() {
        var el = ctx.dragNodeRef.current;
        if (!el) return;
        var ref = checkElementVisible(el, {
            fullVisible: true
        }), visible = ref.visible, bound = ref.bound;
        if (!bound) return;
        var sps = getScrollParent(el, true);
        ctx.group.dndMap[ctx.id] = {
            node: ctx.node,
            visible: visible,
            left: bound.left,
            right: bound.right,
            bottom: bound.bottom,
            top: bound.top,
            props: ctx.props,
            ctx: ctx
        };
        var scrollParents = ctx.group.scrollParents;
        sps.forEach(function(sp) {
            var indOf = scrollParents.indexOf(sp);
            if (indOf === -1) {
                scrollParents.push(sp);
            }
        });
    });
    /** 节流版的updateDNDMeta, 防止高频触发 */ var throttleUpdateDNDMeta = useFn(updateDNDMeta, function(fn) {
        return throttle(fn, 60, {
            trailing: true
        });
    });
    /** 拖动处理, 大部分功能的核心实现都在此处 */ var onDrag = useFn(function(ev) {
        var first = ev.first, last = ev.last, down = ev.down, _xy = _sliced_to_array(ev.xy, 2), x = _xy[0], y = _xy[1], e = ev.event, cancel = ev.cancel, tap = ev.tap, forceBreakEvent = ev.memo;
        if (tap) return;
        // 防止重叠节点一起触发
        e.stopPropagation();
        if (forceBreakEvent) return;
        if (first && _isIgnoreEl(e, props.ignore)) {
            cancel();
            return true;
        }
        var enable = isFunction(enableDrag) ? enableDrag(node) : !!enableDrag;
        if (!enable) {
            cancel();
            return true;
        }
        // 开始拖动时更新所有节点位置信息, 拖动中间歇更新(大部分情况节点位置不会改变, 这样可以节省性能)
        if (first) {
            _updateEvent.emit(false, ctx.props.group);
        } else {
            _updateEvent.emit(true, ctx.props.group);
        }
        // 拖动目标
        var source = ctx.node;
        // 过滤所有被光标命中的有效节点并在开始拖动时更新所有dnd的enable
        var inBoundList = _filterInBoundDNDs(ctx, first, [
            x,
            y
        ]);
        // 基础事件对象
        var event = {
            source: source,
            x: x,
            y: y
        };
        // 开始拖动时设置当前拖动节点状态
        if (first) {
            setState({
                status: _object_spread_props(_object_spread({}, _defaultDNDStatus), {
                    dragging: true,
                    regular: false
                }),
                enables: _object_spread({}, _getObjectByNewValues(_defaultDNDEnableInfos, false))
            });
        }
        /* # # # # # # # 反馈阶段处理 # # # # # # # */ // 初始化反馈节点
        if (last) {
            // reset
            self.feedbackInitOffset = undefined;
            if (self.feedbackEl) {
                self.feedbackEl.parentNode.removeChild(self.feedbackEl);
                self.feedbackEl = undefined;
            }
        } else {
            if (!self.feedbackEl) {
                initFeedbackEl();
            }
            if (self.feedbackEl) {
                if (self.feedbackInitOffset) {
                    // 已经有偏移信息, 说明已经初始化过
                    var _feedbackInitOffset = _sliced_to_array(self.feedbackInitOffset, 2), offsetX = _feedbackInitOffset[0], offsetY = _feedbackInitOffset[1];
                    ctx.feedbackSpApi.set({
                        x: x - offsetX,
                        y: y - offsetY
                    });
                } else {
                    // 因为存在定制feedback节点, 所以需要获取光标到节点的左上角的偏移量比例, 以便在自定义节点上使用同样的比例
                    var nodeBound = ctx.dragNodeRef.current.getBoundingClientRect();
                    var feedbackBound = self.feedbackEl.getBoundingClientRect();
                    var offsetX1 = x - nodeBound.left;
                    var offsetY1 = y - nodeBound.top;
                    var ratioX = offsetX1 / nodeBound.width;
                    var ratioY = offsetY1 / nodeBound.height;
                    var oX = feedbackBound.width * ratioX;
                    var oY = feedbackBound.height * ratioY;
                    ctx.feedbackSpApi.set({
                        x: x - oX,
                        y: y - oY
                    });
                    self.feedbackInitOffset = [
                        oX,
                        oY
                    ];
                }
            }
        }
        /* # # # # # # # 自动滚动 # # # # # # # */ // xy在元素范围边缘一定距离时, 距离靠近边缘移动越快
        ctx.group.scrollParents.forEach(function(ele) {
            autoScrollTrigger({
                xy: ev.xy,
                isLast: last,
                el: ele
            });
        // _autoScrollByStatus(ele, down, _getAutoScrollStatus(ele, x, y));
        });
        /* # # # # # # # 无放置点命中时的处理 # # # # # # # */ if (!inBoundList.length) {
            if (first) {
                var ref;
                (ref = props.onDrag) === null || ref === void 0 ? void 0 : ref.call(props, event);
            } else if (last) {
                var ref1;
                (ref1 = props.onDrop) === null || ref1 === void 0 ? void 0 : ref1.call(props, event);
                // 通知所有组件
                _resetEvent.emit();
                self.lastEntryDND = undefined;
            } else {
                var ref2;
                (ref2 = props.onMove) === null || ref2 === void 0 ? void 0 : ref2.call(props, event);
                // 通知其他组件重置状态
                _resetEvent.emit([
                    ctx.id
                ], true);
                if (self.lastEntryDND) {
                    var _props, ref3;
                    (ref3 = (_props = self.lastEntryDND.props).onSourceLeave) === null || ref3 === void 0 ? void 0 : ref3.call(_props, event);
                    self.lastEntryDND = undefined;
                }
            }
            return;
        }
        /* # # # # # # # 有放置点时的处理 # # # # # # # */ // 从一组同时命中(如果有多个)的dnd中按照指定规则取出一个作为命中点
        var current = _getCurrentTriggerByMultipleTrigger(inBoundList);
        var dnd = current.dnd, enables = current.enables, status = current.status;
        self.lastEntryDND = dnd;
        var dndState = dnd.ctx.state;
        event.target = dnd.node;
        event.status = status;
        // drop相关事件触发
        if (!dndState.status.over) {
            var // 之前未启用, 触发进入事件
            _props1, ref4;
            (ref4 = (_props1 = dnd.props).onSourceEnter) === null || ref4 === void 0 ? void 0 : ref4.call(_props1, event);
        } else if (last) {
            var isAccept = _checkIfAcceptable(enables, status);
            if (isAccept) {
                var // 触发接收事件
                _props2, ref5;
                (ref5 = (_props2 = dnd.props).onSourceAccept) === null || ref5 === void 0 ? void 0 : ref5.call(_props2, event);
            }
        } else {
            var // 已启用且未松开, 触发移动事件
            _props3, ref6;
            (ref6 = (_props3 = dnd.props).onSourceMove) === null || ref6 === void 0 ? void 0 : ref6.call(_props3, event);
        }
        // 有命中时的drag出发
        if (first) {
            var ref7;
            (ref7 = props.onDrag) === null || ref7 === void 0 ? void 0 : ref7.call(props, event);
        } else if (last) {
            var ref8;
            (ref8 = props.onDrop) === null || ref8 === void 0 ? void 0 : ref8.call(props, event);
        } else {
            var ref9;
            (ref9 = props.onMove) === null || ref9 === void 0 ? void 0 : ref9.call(props, event);
        }
        // 状态有变时进行更新
        if (!isEqual(dndState.enables, enables) || !isEqual(dndState.status, status)) {
            dnd.ctx.setState({
                enables: enables,
                status: status
            });
        }
        if (last) {
            _resetEvent.emit([]);
            self.lastEntryDND = undefined;
        } else {
            // 通知重置
            _resetEvent.emit([
                ctx.id,
                dnd.ctx.id
            ], true);
        }
    });
    return {
        onDrag: onDrag,
        updateDNDMeta: updateDNDMeta,
        throttleUpdateDNDMeta: throttleUpdateDNDMeta
    };
}
