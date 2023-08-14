import React, { ReactElement, useEffect, useRef } from "react";
import { _RCTableContext } from "./types.js";
import { useFn, useSetState } from "@m78/hooks";
import { TableFeedbackEvent } from "../table-vanilla/plugins/event.js";
import { Bubble } from "../bubble/index.js";
import { OverlayInstance } from "../overlay/index.js";

/** 对table.event.feedback内容进行反馈 */
export function _useFeedback(ctx: _RCTableContext) {
  const { state } = ctx;

  const bubbleRef = useRef<OverlayInstance>(null!);

  const [fbState, setFbState] = useSetState({
    content: null as ReactElement | null,
  });

  const feedbackHandle = useFn((e: TableFeedbackEvent[]) => {
    console.log(e);
    console.log(bubbleRef.current);
  });

  useEffect(() => {
    if (!state.instance) return;

    state.instance.event.feedback.on(feedbackHandle);

    return () => {
      state.instance.event.feedback.off(feedbackHandle);
    };
  }, [state.instance]);

  return <Bubble content={fbState.content} instanceRef={bubbleRef}></Bubble>;
}
