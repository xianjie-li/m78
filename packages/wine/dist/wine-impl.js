import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useImperativeHandle, useMemo, useRef } from "react";
import { useSelf, useSetState } from "@m78/hooks";
import { config, useSpring } from "react-spring";
import { createRandString } from "@m78/utils";
import { NO_LIMIT_AREA } from "./consts";
import { useMethods } from "./useMethods";
import { useLifeCycle } from "./useLifeCycle";
import { render } from "./render";
import { getSizeByState } from "./common";
var WineImpl = function(props) {
    var ref = _sliced_to_array(useSetState(function() {
        return {
            isFull: false,
            headerHeight: undefined,
            refreshKey: createRandString(),
            id: createRandString()
        };
    }), 2), insideState = ref[0], setInsideState = ref[1];
    var wrapElRef = useRef(null);
    var headerElRef = useRef(null);
    var ref1 = _sliced_to_array(useSpring(function() {
        var ref = _sliced_to_array(getSizeByState(props), 2), width = ref[0], height = ref[1];
        return {
            opacity: 0,
            x: 0,
            y: 0,
            config: config.stiff,
            width: width,
            height: height,
            display: "none",
            visibility: "hidden"
        };
    }), 2), spProps = ref1[0], spApi = ref1[1];
    var self = useSelf({
        x: 0,
        y: 0,
        winSize: [
            0,
            0
        ],
        availableSize: [
            0,
            0
        ],
        wrapSize: [
            0,
            0
        ],
        headerSize: [
            0,
            0
        ],
        fullSize: [
            0,
            0
        ],
        bound: NO_LIMIT_AREA,
        windowBound: NO_LIMIT_AREA
    });
    var ctx = {
        wrapElRef: wrapElRef,
        headerElRef: headerElRef,
        state: props,
        setInsideState: setInsideState,
        insideState: insideState,
        self: self,
        spProps: spProps,
        spApi: spApi,
        dragLineRRef: null,
        dragLineLRef: null,
        dragLineBRef: null,
        dragLineTRef: null,
        dragLineLTRef: null,
        dragLineRTRef: null,
        dragLineRBRef: null,
        dragLineLBRef: null
    };
    var methods = useMethods(ctx);
    useLifeCycle(ctx, methods);
    var ins = useMemo(function() {
        var instance = {
            el: wrapElRef,
            top: methods.top,
            full: methods.full,
            resize: methods.resize,
            refresh: function() {
                setInsideState({
                    refreshKey: createRandString()
                });
            },
            setPresetPosition: methods.setPresetPosition,
            meta: self
        };
        return instance;
    }, []);
    useImperativeHandle(props.instanceRef, function() {
        return ins;
    }, []);
    return render(ctx, methods, ins);
};
export default WineImpl;
