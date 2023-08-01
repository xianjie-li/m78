import { useFn } from "@m78/hooks";
import { useEffect } from "react";
import { notify } from "../notify/index.js";
// 将部分table实例事件直接暴露为props, 并对某些事件进行处理
export function _useEvent(ctx) {
    var state = ctx.state, setState = ctx.setState, props = ctx.props;
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
    var mutation = useFn(function(event) {
        var ref;
        (ref = props.onMutation) === null || ref === void 0 ? void 0 : ref.call(props, event);
        setState({
            renderID: Math.random()
        });
    });
    useEffect(function() {
        if (!state.instance) return;
        state.instance.event.error.on(error);
        state.instance.event.click.on(click);
        state.instance.event.select.on(select);
        state.instance.event.mutation.on(mutation);
        return function() {
            state.instance.event.error.off(error);
            state.instance.event.click.off(click);
            state.instance.event.select.off(select);
            state.instance.event.mutation.off(mutation);
        };
    }, [
        state.instance
    ]);
}
