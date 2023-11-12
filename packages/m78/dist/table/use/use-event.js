import { useFn } from "@m78/hooks";
import { useEffect } from "react";
import { TableReloadLevel } from "../../table-vanilla/index.js";
import { notify } from "../../notify/index.js";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { _getTableCtx } from "../common.js";
// 将部分table实例事件直接暴露为props, 并对某些事件进行处理
export function _useEvent() {
    var ref = _injector.useDeps(_useStateAct), state = ref.state, setState = ref.setState;
    var props = _injector.useProps();
    var error = useFn(function(msg) {
        var ref;
        (ref = props.onError) === null || ref === void 0 ? void 0 : ref.call(props, msg);
        notify.warning(msg);
    });
    var click = useFn(function(cell, event) {
        var ref;
        (ref = props.onClick) === null || ref === void 0 ? void 0 : ref.call(props, cell, event);
    });
    var select = useFn(function() {
        var ref;
        (ref = props.onSelect) === null || ref === void 0 ? void 0 : ref.call(props);
        setState({
            selectedRows: state.instance.getSelectedRows()
        });
    });
    // 数据变更时, 重新计算行数等
    var dataChange = useFn(function() {
        var ref;
        setState({
            rowCount: ((ref = _getTableCtx(state.instance)) === null || ref === void 0 ? void 0 : ref.allRowKeys.length) || 0
        });
    });
    var mutation = useFn(function(event) {
        var ref;
        (ref = props.onMutation) === null || ref === void 0 ? void 0 : ref.call(props, event);
        setState({
            renderID: Math.random()
        });
    });
    var reload = useFn(function(opt) {
        if (opt.level === TableReloadLevel.full || opt.level === TableReloadLevel.index) {
            dataChange();
        }
    });
    useEffect(function() {
        if (!state.instance) return;
        dataChange();
        state.instance.event.error.on(error);
        state.instance.event.click.on(click);
        state.instance.event.select.on(select);
        state.instance.event.mutation.on(mutation);
        state.instance.event.reload.on(reload);
        return function() {
            state.instance.event.error.off(error);
            state.instance.event.click.off(click);
            state.instance.event.select.off(select);
            state.instance.event.mutation.off(mutation);
            state.instance.event.reload.off(reload);
        };
    }, [
        state.instance
    ]);
}
