import "./index.scss";
import { TriggerType } from "./types.js";
import { createEvent, ensureArray } from "@m78/utils";
import { _targetOperationImpl } from "./target-operation.js";
import { _checkImpl } from "./check.js";
import { _eventImpl } from "./event.js";
import { _updateTypeEnableMap } from "./methods.js";
import { _actionImpl } from "./action.js";
import { _lifeImpl } from "./life.js";
/**
 * 事件触发器, 可在dom或虚拟位置上绑定事件, 支持大部分常用事件, 相比原生事件更易于使用
 *
 * 对于有拖拽行为的事件, 始终应该为对应节点添加 .m78-touch-prevent , 反正原生行为的干扰
 * */ export function _create(config) {
    var ctx = {
        config: config,
        eventMap: new Map(),
        targetList: [],
        trigger: {
            event: createEvent()
        },
        container: config.container || document.documentElement,
        type: ensureArray(config.type),
        enable: true,
        dragging: false,
        activating: false,
        typeEnableMap: {},
        currentFocus: [],
        moveRecord: new Map(),
        activeRecord: new Map(),
        dragRecord: new Map(),
        event: {},
        clearPending: function() {},
        getTargetDataByXY: function() {
            return [];
        },
        clearAllPending: function() {}
    };
    /* # # # # # # # 实现部分 # # # # # # # */ ctx.event = _eventImpl(ctx);
    _targetOperationImpl(ctx);
    _checkImpl(ctx);
    _actionImpl(ctx);
    _lifeImpl(ctx);
    /* # # # # # # # 初始化调用 # # # # # # # */ _updateTypeEnableMap(ctx);
    ctx.trigger.add(config.target);
    ctx.event.bind();
    ctx.trigger.event.on(function(e) {
        if (e.type === TriggerType.active) {
            if ("target" in e.target && e.target.cursor) {
                ctx.trigger.cursor = e.active ? e.target.cursor : "";
            }
        }
    });
    return ctx.trigger;
}
