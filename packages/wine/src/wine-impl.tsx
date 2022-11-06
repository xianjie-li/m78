import { useImperativeHandle, useMemo, useRef } from "react";
import { useSelf, useSetState } from "@m78/hooks";
import { config, useSpring } from "react-spring";
import { createRandString } from "@m78/utils";
import {
  WineSelf,
  _WineAnimateProps,
  _WineContext,
  _WineInsideState,
  WineState,
  WineInstance,
} from "./types";

import { DEFAULT_PROPS, NO_LIMIT_AREA } from "./consts";
import { useMethods } from "./useMethods";
import { useLifeCycle } from "./useLifeCycle";
import { render } from "./render";
import { getSizeByState } from "./common";

type TrimDefaultState = WineState & typeof DEFAULT_PROPS;

const WineImpl = (props: WineState) => {
  const [insideState, setInsideState] = useSetState<_WineInsideState>(() => ({
    isFull: false,
    headerHeight: undefined,
    refreshKey: createRandString(),
    id: createRandString(),
  }));

  const wrapElRef = useRef<HTMLDivElement>(null!);
  const headerElRef = useRef<HTMLDivElement>(null!);

  const [spProps, spApi] = useSpring<_WineAnimateProps>(() => {
    const [width, height] = getSizeByState(props as TrimDefaultState);
    return {
      opacity: 0,
      x: 0,
      y: 0,
      config: config.stiff,
      width,
      height,
      display: "none",
      visibility: "hidden",
    };
  });

  const self = useSelf<WineSelf>({
    x: 0,
    y: 0,
    winSize: [0, 0],
    availableSize: [0, 0],
    wrapSize: [0, 0],
    headerSize: [0, 0],
    fullSize: [0, 0],
    bound: NO_LIMIT_AREA,
    windowBound: NO_LIMIT_AREA,
  });

  const ctx: _WineContext = {
    wrapElRef,
    headerElRef,
    state: props as TrimDefaultState,
    setInsideState,
    insideState,
    self,
    spProps,
    spApi,
    dragLineRRef: null as any,
    dragLineLRef: null as any,
    dragLineBRef: null as any,
    dragLineTRef: null as any,
    dragLineLTRef: null as any,
    dragLineRTRef: null as any,
    dragLineRBRef: null as any,
    dragLineLBRef: null as any,
  };

  const methods = useMethods(ctx);

  useLifeCycle(ctx, methods);

  const ins = useMemo(() => {
    const instance: WineInstance = {
      el: wrapElRef,
      top: methods.top,
      full: methods.full,
      resize: methods.resize,
      refresh: () => {
        setInsideState({
          refreshKey: createRandString(),
        });
      },
      setPresetPosition: methods.setPresetPosition,
      meta: self,
    };
    return instance;
  }, []);

  useImperativeHandle(props.instanceRef, () => ins, []);

  return render(ctx, methods, ins);
};

export default WineImpl;
