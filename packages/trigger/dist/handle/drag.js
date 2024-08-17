import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { TriggerType } from "../types.js";
import { getEventOffset, getEventXY } from "@m78/utils";
import { _buildEvent } from "../methods.js";
import { _dragMinDistance } from "../common.js";
/** 在拖动超过bound边界时产生的阻尼系数 */ var BoundDamping = 0.16;
export function _dragImpl(ctx) {
    var trigger = ctx.trigger;
    var dragRecord = new Map();
    // 记录鼠标或触摸点按下后移动的总距离
    var lastXPoint = 0;
    var lastYPoint = 0;
    var xDistance = 0;
    var yDistance = 0;
    // 鼠标左键点击时进行标记, 用于在move中触发drag, 用于过滤简单点击和drag
    var dragTriggerFlag = false;
    // 从OptionItem中获取事件的私有状态
    function getEventData(option) {
        var cur = ctx.keepAliveData.get(option);
        if (!cur.drag) {
            cur.drag = {
                distanceX: 0,
                distanceY: 0
            };
        }
        return cur.drag;
    }
    // 从OptionItem中设置事件的私有状态
    function setEventData(option, args) {
        var cur = getEventData(option);
        Object.assign(cur, args);
    }
    function start(e) {
        var _getEventXY = _sliced_to_array(getEventXY(e), 2), clientX = _getEventXY[0], clientY = _getEventXY[1];
        var eventList = ctx.getEventList({
            xy: [
                clientX,
                clientY
            ],
            type: TriggerType.drag,
            dom: e.target
        }).eventList;
        eventList.forEach(function(i) {
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var distance = getEventData(i.option);
            var event = _buildEvent({
                type: TriggerType.drag,
                nativeEvent: e,
                target: i.option,
                x: clientX,
                y: clientY,
                offsetX: offsetX,
                offsetY: offsetY,
                data: i.option.data,
                eventMeta: i,
                distanceX: distance.distanceX,
                distanceY: distance.distanceY
            });
            var record = {
                clientX: clientX,
                clientY: clientY,
                movementX: 0,
                movementY: 0,
                offsetX: offsetX,
                offsetY: offsetY,
                target: i.option,
                eventData: i,
                nativeEvent: e,
                startEvent: event
            };
            dragRecord.set(i.option, record);
            ctx.handleEvent(event);
            i.option.handler(event);
        });
        var dragging = dragRecord.size !== 0;
        trigger.dragging = dragging;
        if (dragging) {
            ctx.event.activeHandle.clear();
            ctx.event.focusHandle.clear();
            ctx.event.moveHandle.clear();
        }
        return dragging;
    }
    function move(e) {
        moveAndEnd(e, false);
    }
    function end(e) {
        dragTriggerFlag = false;
        lastXPoint = 0;
        lastYPoint = 0;
        xDistance = 0;
        yDistance = 0;
        moveAndEnd(e, true);
    }
    function moveAndEnd(e, isEnd) {
        var isCancel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        trigger.dragging = dragRecord.size !== 0;
        if (!trigger.dragging) return;
        var list = Array.from(dragRecord.values());
        var clientX = 0;
        var clientY = 0;
        if (!isCancel && e) {
            var ref;
            ref = _sliced_to_array(getEventXY(e), 2), clientX = ref[0], clientY = ref[1], ref;
        }
        list.forEach(function(i) {
            var deltaX = 0;
            var deltaY = 0;
            // 上次事件记录的位置
            var distance = getEventData(i.target);
            var distanceX = 0;
            var distanceY = 0;
            if (!isCancel && e) {
                var freshEventData = ctx.updateTargetData(i.eventData);
                i.eventData = freshEventData;
                var ref;
                ref = _sliced_to_array(getEventOffset(e, freshEventData.bound), 2), i.offsetX = ref[0], i.offsetY = ref[1], ref;
                deltaX = clientX - i.clientX;
                deltaY = clientY - i.clientY;
                var _clampBound = _sliced_to_array(clampBound({
                    record: i,
                    deltaX: deltaX,
                    deltaY: deltaY,
                    isEnd: isEnd
                }), 2), movementX = _clampBound[0], movementY = _clampBound[1];
                i.clientX = clientX;
                i.clientY = clientY;
                i.movementX = movementX;
                i.movementY = movementY;
                distanceX = distance.distanceX + i.movementX;
                distanceY = distance.distanceY + i.movementY;
            }
            var event = _buildEvent({
                type: TriggerType.drag,
                nativeEvent: e || i.nativeEvent,
                target: i.target,
                first: false,
                last: isEnd,
                x: i.clientX,
                y: i.clientY,
                offsetX: i.offsetX,
                offsetY: i.offsetY,
                deltaX: deltaX,
                deltaY: deltaY,
                movementX: i.movementX,
                movementY: i.movementY,
                data: i.target.data,
                eventMeta: i.eventData,
                distanceX: distanceX,
                distanceY: distanceY
            });
            if (isEnd) {
                dragRecord.delete(i.target);
                setEventData(i.target, {
                    distanceX: distanceX,
                    distanceY: distanceY
                });
            }
            ctx.handleEvent(event);
            i.target.handler(event);
        });
    }
    // 将拖动位置限制在边界内
    function clampBound(args) {
        var record = args.record, deltaX = args.deltaX, deltaY = args.deltaY, isEnd = args.isEnd;
        var dragBound = record.target.dragBound;
        // 移动后位置
        var nextMovementX = record.movementX + deltaX;
        var nextMovementY = record.movementY + deltaY;
        if (!dragBound) return [
            nextMovementX,
            nextMovementY
        ];
        // 最终应用的位置
        var x = nextMovementX;
        var y = nextMovementY;
        var startBound = record.startEvent.eventMeta.bound;
        var xMin = -startBound.left + dragBound.left;
        var xMax = dragBound.left + dragBound.width - (startBound.left + startBound.width);
        var yMin = -startBound.top + dragBound.top;
        var yMax = dragBound.top + dragBound.height - (startBound.top + startBound.height);
        // 当前未超出, 移动后超出, 为防止单次移动距离过大元素直接移出, 将其设置到边界位置
        if (record.movementX > xMin && nextMovementX < xMin) {
            x = xMin;
        }
        if (record.movementX < xMax && nextMovementX > xMax) {
            x = xMax;
        }
        if (record.movementY > yMin && nextMovementY < yMin) {
            y = yMin;
        }
        if (record.movementY < yMax && nextMovementY > yMax) {
            y = yMax;
        }
        var lessLeft = nextMovementX < xMin;
        var thenRight = nextMovementX > xMax;
        // 移动后超出边界, 添加阻尼效果
        if (lessLeft || thenRight) {
            if (isEnd) {
                if (lessLeft) x = xMin;
                if (thenRight) x = xMax;
            } else {
                var limitDeltaX = deltaX * BoundDamping;
                x = record.movementX + limitDeltaX;
            }
        }
        var lessTop = nextMovementY < yMin;
        var thenBottom = nextMovementY > yMax;
        if (lessTop || thenBottom) {
            if (isEnd) {
                if (lessTop) y = yMin;
                if (thenBottom) y = yMax;
            } else {
                var limitDeltaY = deltaY * BoundDamping;
                y = record.movementY + limitDeltaY;
            }
        }
        return [
            x,
            y
        ];
    }
    function clear() {
        moveAndEnd(null, true, true);
    }
    // 辅助drag记录事件开始点
    function startMark(e) {
        dragTriggerFlag = true;
        var _getEventXY = _sliced_to_array(getEventXY(e), 2), x = _getEventXY[0], y = _getEventXY[1];
        lastXPoint = x;
        lastYPoint = y;
        xDistance = 0;
        yDistance = 0;
    }
    // 在move事件中处理drag事件开始/move
    function dragTrigger(e) {
        if (dragTriggerFlag) {
            var _getEventXY = _sliced_to_array(getEventXY(e), 2), x = _getEventXY[0], y = _getEventXY[1];
            var xDiff = Math.abs(x - lastXPoint);
            var yDiff = Math.abs(y - lastYPoint);
            xDistance += xDiff;
            yDistance += yDiff;
            if (xDistance > _dragMinDistance || yDistance > _dragMinDistance) {
                start(e);
                dragTriggerFlag = false;
            }
        } else {
            move(e);
        }
    }
    return {
        start: start,
        move: move,
        end: end,
        clear: clear,
        startMark: startMark,
        dragTrigger: dragTrigger
    };
}
