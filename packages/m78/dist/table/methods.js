import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { createTable } from "../table-vanilla/index.js";
import { createEvent } from "@m78/hooks";
export function _useMethods(ctx) {
    var updateInstance = /** 创建/更新表格实例 */ function updateInstance(propsConf, isFull) {
        console.log("reload", isFull ? "full" : "index");
        if (state.instance) {
            state.instance.setConfig(propsConf, !isFull);
            setState({
                renderID: Math.random()
            });
            return;
        }
        setState({
            instance: createTable(_object_spread_props(_object_spread({}, propsConf), {
                el: ref.current,
                viewEl: scrollRef.current,
                viewContentEl: scrollContRef.current,
                emptyNode: state.emptyNode,
                emptySize: 120,
                eventCreator: createEvent,
                render: customRender.render,
                interactive: editRender.interactiveEnableChecker,
                interactiveRender: editRender.interactiveRender
            }))
        });
    };
    var initEmptyNode = /** 初始化定制空节点 */ function initEmptyNode() {
        var emptyNode = document.createElement("div");
        emptyNode.className = "m78-table_empty-wrap";
        setState({
            emptyNode: emptyNode
        });
    };
    var ref = ctx.ref, scrollRef = ctx.scrollRef, scrollContRef = ctx.scrollContRef, state = ctx.state, setState = ctx.setState, editRender = ctx.editRender, customRender = ctx.customRender;
    return {
        initEmptyNode: initEmptyNode,
        updateInstance: updateInstance
    };
}
