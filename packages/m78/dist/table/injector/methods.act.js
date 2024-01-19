import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { createTable } from "../../table-vanilla/index.js";
import { createEvent } from "@m78/hooks";
import { i18n, TABLE_NS } from "../../i18n/index.js";
import { _useStateAct } from "./state.act.js";
import { _useEditRender } from "../render/use-edit-render.js";
import { _useCustomRender } from "../render/use-custom-render.js";
import { _injector } from "../table.js";
import { createRandString, isFunction } from "@m78/utils";
import { createForm } from "../../form/index.js";
export function _useMethodsAct() {
    var _injector_useDeps = _injector.useDeps(_useStateAct), ref = _injector_useDeps.ref, scrollRef = _injector_useDeps.scrollRef, scrollContRef = _injector_useDeps.scrollContRef, wrapRef = _injector_useDeps.wrapRef, state = _injector_useDeps.state, setState = _injector_useDeps.setState, self = _injector_useDeps.self, plugins = _injector_useDeps.plugins;
    var props = _injector.useProps();
    var editRender = _useEditRender();
    var customRender = _useCustomRender();
    /** 创建/更新表格实例 */ function updateInstance(propsConf, isFull) {
        console.log("reload", isFull ? "full" : "index");
        if (state.instance) {
            state.instance.setConfig(propsConf, !isFull);
            setState({
                renderID: Math.random()
            });
            return;
        }
        var texts = i18n.getResourceBundle(i18n.language, TABLE_NS);
        var ins = createTable(_object_spread_props(_object_spread({}, props), {
            el: ref.current,
            viewEl: scrollRef.current,
            viewContentEl: scrollContRef.current,
            emptyNode: state.emptyNode,
            emptySize: 180,
            eventCreator: createEvent,
            render: customRender.render,
            interactive: editRender.interactiveEnableChecker,
            interactiveRender: editRender.interactiveRender,
            texts: texts,
            extraActiveCheckEl: wrapRef.current,
            formCreator: createForm,
            plugins: plugins,
            persistenceConfig: state.persistenceConfig
        }));
        setState({
            instance: ins
        });
    }
    /** 初始化定制空节点 */ function initEmptyNode() {
        var emptyNode = document.createElement("div");
        emptyNode.className = "m78-table_empty-wrap";
        setState({
            emptyNode: emptyNode
        });
    }
    /** 获取新的新的默认数据 */ function getDefaultNewData() {
        var def = props.defaultNewData;
        if (isFunction(def)) {
            def = def();
        }
        return _object_spread_props(_object_spread({}, def), _define_property({}, props.primaryKey, createRandString()));
    }
    /** 记录每一个需要阻止默认键盘等操作行为的弹层启用/关闭, 在包含弹层时, 阻止table的交互 */ function overlayStackChange(open) {
        var _state_instance;
        if (open) {
            self.overlayStackCount++;
        } else {
            self.overlayStackCount--;
            if (self.overlayStackCount < 0) {
                self.overlayStackCount = 0;
            }
        }
        (_state_instance = state.instance) === null || _state_instance === void 0 ? void 0 : _state_instance.isActive(!self.overlayStackCount);
    }
    /** 更新editCheckForm, 应在schema变更时触发 */ function updateCheckForm() {
        self.editStatusMap = {};
        var ls = props.schema || [];
        if (self.editCheckForm) {
            self.editCheckForm.setSchemas({
                schema: ls
            });
            return;
        }
        self.editCheckForm = createForm({
            schemas: {
                schema: ls
            },
            autoVerify: false
        });
    }
    return {
        initEmptyNode: initEmptyNode,
        updateInstance: updateInstance,
        updateCheckForm: updateCheckForm,
        getDefaultNewData: getDefaultNewData,
        overlayStackChange: overlayStackChange
    };
}
