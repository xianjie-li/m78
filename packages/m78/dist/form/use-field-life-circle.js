import { isFunction, stringifyNamePath, triggerHighlight } from "@m78/utils";
import { _useUpdatePropsChange } from "./use-update-props-change.js";
import { _useDetector } from "./field-detector.js";
export function _useFieldLifeCircle(ctx, fieldCtx, methods) {
    var form = ctx.form;
    var name = fieldCtx.name, setState = fieldCtx.setState, wrapRef = fieldCtx.wrapRef;
    var getProps = methods.getProps;
    // 监听变更, 更新组件
    form.events.update.useEvent(form.notifyFilter(name, function() {
        setState({
            schema: form.getSchema(name),
            renderKey: Math.random()
        });
    }, getProps("deps")));
    // 监听updateProps更新组件
    _useUpdatePropsChange(ctx, function() {
        setState({
            renderKey: Math.random()
        });
    });
    // 通知Detector组件注册/注销
    _useDetector(name);
    // 错误时, 高亮并 focus 第一个错误项对应的表单
    form.events.fail.useEvent(function(errors, isValueChangeTrigger) {
        // 值变更导致的错误不触发高亮反馈
        if (isValueChangeTrigger) return;
        var first = errors[0];
        if (!first) return;
        var sName = stringifyNamePath(name);
        if (sName === first.name) {
            triggerHighlight(wrapRef.current);
            var inp = wrapRef.current.querySelector("input,select,textarea,button");
            if (inp && isFunction(inp.focus)) inp.focus();
        }
    });
}
