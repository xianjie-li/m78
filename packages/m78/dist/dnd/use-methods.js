import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { checkElementVisible, getScrollParent, isDom, isFunction, isObject, simplyEqual as isEqual } from "@m78/utils";
import { autoScrollTrigger } from "@m78/animate-tools";
import { useFn } from "@m78/hooks";
import throttle from "lodash/throttle.js";
import { _defaultDNDEnableInfos, _defaultDNDStatus, _resetEvent, _updateEvent, _checkIfAcceptable, _filterInBoundDNDs, _getCurrentTriggerByMultipleTrigger, _isIgnoreEl, _getObjectByNewValues, _draggingEvent } from "./common.js";
import clsx from "clsx";
export function _useMethods(ctx) {
    var setState = ctx.setState, props = ctx.props, self = ctx.self, dragNodeRef = ctx.dragNodeRef, node = ctx.node;
    var enableDrag = props.enableDrag;
    /** 更新当前节点的位置等信息到context中 */ var updateDNDMeta = useFn(function() {
        var el = ctx.dragNodeRef.current;
        if (!el) return;
        var _checkElementVisible = checkElementVisible(el, {
            fullVisible: true
        }), visible = _checkElementVisible.visible, bound = _checkElementVisible.bound;
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
        var first = ev.first, last = ev.last, _ev_xy = _sliced_to_array(ev.xy, 2), x = _ev_xy[0], y = _ev_xy[1], e = ev.event, cancel = ev.cancel, tap = ev.tap, forceBreakEvent = ev.memo;
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
            _draggingEvent.emit(ctx.id, true, ctx.props.group);
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
                    var _self_feedbackInitOffset = _sliced_to_array(self.feedbackInitOffset, 2), offsetX = _self_feedbackInitOffset[0], offsetY = _self_feedbackInitOffset[1];
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
                var _props_onDrag;
                (_props_onDrag = props.onDrag) === null || _props_onDrag === void 0 ? void 0 : _props_onDrag.call(props, event);
            } else if (last) {
                var _props_onDrop;
                (_props_onDrop = props.onDrop) === null || _props_onDrop === void 0 ? void 0 : _props_onDrop.call(props, event);
                // 通知所有组件
                _resetEvent.emit();
                _draggingEvent.emit(ctx.id, false, ctx.props.group);
                self.lastEntryDND = undefined;
            } else {
                var _props_onMove;
                (_props_onMove = props.onMove) === null || _props_onMove === void 0 ? void 0 : _props_onMove.call(props, event);
                // 通知其他组件重置状态
                _resetEvent.emit([
                    ctx.id
                ], true);
                if (self.lastEntryDND) {
                    var _self_lastEntryDND_props_onSourceLeave, _self_lastEntryDND_props;
                    (_self_lastEntryDND_props_onSourceLeave = (_self_lastEntryDND_props = self.lastEntryDND.props).onSourceLeave) === null || _self_lastEntryDND_props_onSourceLeave === void 0 ? void 0 : _self_lastEntryDND_props_onSourceLeave.call(_self_lastEntryDND_props, event);
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
            _dnd_props_onSourceEnter, _dnd_props;
            (_dnd_props_onSourceEnter = (_dnd_props = dnd.props).onSourceEnter) === null || _dnd_props_onSourceEnter === void 0 ? void 0 : _dnd_props_onSourceEnter.call(_dnd_props, event);
        } else if (last) {
            var isAccept = _checkIfAcceptable(enables, status);
            if (isAccept) {
                var // 触发接收事件
                _dnd_props_onSourceAccept, _dnd_props1;
                (_dnd_props_onSourceAccept = (_dnd_props1 = dnd.props).onSourceAccept) === null || _dnd_props_onSourceAccept === void 0 ? void 0 : _dnd_props_onSourceAccept.call(_dnd_props1, event);
            }
        } else {
            var // 已启用且未松开, 触发移动事件
            _dnd_props_onSourceMove, _dnd_props2;
            (_dnd_props_onSourceMove = (_dnd_props2 = dnd.props).onSourceMove) === null || _dnd_props_onSourceMove === void 0 ? void 0 : _dnd_props_onSourceMove.call(_dnd_props2, event);
        }
        // 有命中时的drag出发
        if (first) {
            var _props_onDrag1;
            (_props_onDrag1 = props.onDrag) === null || _props_onDrag1 === void 0 ? void 0 : _props_onDrag1.call(props, event);
        } else if (last) {
            var _props_onDrop1;
            (_props_onDrop1 = props.onDrop) === null || _props_onDrop1 === void 0 ? void 0 : _props_onDrop1.call(props, event);
        } else {
            var _props_onMove1;
            (_props_onMove1 = props.onMove) === null || _props_onMove1 === void 0 ? void 0 : _props_onMove1.call(props, event);
        }
        // hasDragging不需要对比
        status.hasDragging = dndState.status.hasDragging;
        // 状态有变时进行更新
        if (!isEqual(dndState.enables, enables) || !isEqual(dndState.status, status)) {
            dnd.ctx.setState({
                enables: enables,
                status: status
            });
        }
        if (last) {
            _resetEvent.emit([]);
            _draggingEvent.emit(ctx.id, false, ctx.props.group);
            self.lastEntryDND = undefined;
        } else {
            // 通知重置
            _resetEvent.emit([
                ctx.id,
                dnd.ctx.id
            ], true);
        }
    });
    /** 开始拖动时使用, 初始化self.feedbackEl以便使用 */ function initFeedbackEl() {
        updateFeedbackEl();
        if (!self.feedbackEl) return;
        self.feedbackEl.className = clsx(self.feedbackEl.className, "m78 m78-dnd_feedback");
        if (isObject(props.feedbackStyle)) {
            Object.entries(props.feedbackStyle).forEach(function(param) {
                var _param = _sliced_to_array(param, 2), key = _param[0], sty = _param[1];
                self.feedbackEl.style[key] = sty;
            });
        }
    }
    /** 根据配置和环境获取self.feedback */ function updateFeedbackEl() {
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
    }
    return {
        onDrag: onDrag,
        updateDNDMeta: updateDNDMeta,
        throttleUpdateDNDMeta: throttleUpdateDNDMeta
    };
}
