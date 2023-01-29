import { useFn, useKeyboard } from "@m78/hooks";
import { getValueByDataSource } from "../common/index.js";
import { _flatOptions, _getOptionAllValues } from "./common.js";
import { useEffect } from "react";
export function useKeyboardHandle(ctx) {
    var hasSelected = ctx.hasSelected, props = ctx.props, openSelect = ctx.openSelect, openChangeHandle = ctx.openChangeHandle, self = ctx.self, state = ctx.state, setState = ctx.setState, close = ctx.close;
    /** 同步生成flat map */ useEffect(function() {
        self.flatMap = _flatOptions(props.options);
    }, [
        props.options
    ]);
    /** 关闭指定列表的所有项 */ var closeList = useFn(function(sibling) {
        var values = _getOptionAllValues(sibling, props);
        openSelect.unSelectList(values);
    });
    useKeyboard({
        onTrigger: function(param) {
            var code = param.code, nativeEvent = param.nativeEvent;
            nativeEvent.preventDefault();
            if (!state.current && !self.lastActive) {
                setState({
                    current: props.options[0] || null
                });
                return;
            }
            var flatOption;
            if (self.lastActive) {
                flatOption = self.flatMap[self.lastActive];
                self.lastActive = null;
            }
            if (!flatOption && state.current) {
                flatOption = self.flatMap[getValueByDataSource(state.current)];
            }
            if (!flatOption) return;
            if (code === "ArrowDown") {
                setState({
                    current: flatOption.next || null
                });
            }
            if (code === "ArrowUp") {
                setState({
                    current: flatOption.prev || null
                });
            }
            if (code === "ArrowRight") {
                openChangeHandle(true, flatOption.value, flatOption.siblings, true);
                if (flatOption.child) {
                    setState({
                        current: flatOption.child || null
                    });
                }
            }
            if (code === "ArrowLeft") {
                if (!flatOption.parent) return;
                var parentOption = self.flatMap[getValueByDataSource(flatOption.parent)];
                closeList(parentOption.siblings);
                setState({
                    current: flatOption.parent || null
                });
            }
        },
        priority: 1000,
        code: [
            "ArrowUp",
            "ArrowDown",
            "ArrowLeft",
            "ArrowRight"
        ],
        enable: hasSelected
    });
    useKeyboard({
        onTrigger: function(e) {
            e.nativeEvent.preventDefault();
            if (state.current) {
                var ref;
                e.code !== "Escape" && ((ref = props.onConfirm) === null || ref === void 0 ? void 0 : ref.call(props, getValueByDataSource(state.current), state.current));
                close();
            }
        },
        priority: 1000,
        code: [
            "Enter",
            "Space",
            "Escape"
        ],
        enable: hasSelected
    });
}
