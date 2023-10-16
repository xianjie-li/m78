import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useMemo, useRef } from "react";
import { createEvent, useSelf, useSetState } from "@m78/hooks";
import { _useFilterForm } from "./filter/use-filter-form.js";
import { _injector } from "./table.js";
export function _useStateAct() {
    var props = _injector.useProps();
    /** 实例容器 */ var ref = useRef(null);
    /** 滚动容器 */ var scrollRef = useRef(null);
    /** 滚动内容 */ var scrollContRef = useRef(null);
    /** 最外层包裹容器 */ var wrapRef = useRef(null);
    var self = useSelf({
        renderMap: {},
        editMap: {},
        editStatusMap: {},
        editCheckForm: null,
        overlayStackCount: 0
    });
    var ref1 = _sliced_to_array(useSetState({
        selectedRows: [],
        rowCount: 0,
        instance: null
    }), 2), state = ref1[0], setState = ref1[1];
    var filterForm = _useFilterForm(props);
    var scrollEvent = useMemo(function() {
        return createEvent();
    }, []);
    return {
        self: self,
        state: state,
        setState: setState,
        ref: ref,
        scrollRef: scrollRef,
        scrollContRef: scrollContRef,
        wrapRef: wrapRef,
        filterForm: filterForm,
        scrollEvent: scrollEvent
    };
}
