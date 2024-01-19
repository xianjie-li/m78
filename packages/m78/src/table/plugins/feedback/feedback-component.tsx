import React, { ReactElement, useEffect, useRef } from "react";
import { OverlayDirection, OverlayInstance } from "../../../overlay/index.js";
import { useSelf, useSetState } from "@m78/hooks";
import { Bubble } from "../../../bubble/index.js";
import clsx from "clsx";
import { Divider } from "../../../layout/index.js";
import { TableCellWithDom } from "../../../table-vanilla/index.js";
import { createRandString, isTruthyOrZero } from "@m78/utils";
import { _injector } from "../../table.js";
import { _useStateAct } from "../../injector/state.act.js";
import { renderCommonHandle } from "../../render/use-custom-render.js";
import {
  TableFeedback,
  TableFeedbackEvent,
} from "../../../table-vanilla/plugins/feedback.js";

export function _Feedback() {
  const props = _injector.useProps();
  const { state, rcPlugins } = _injector.useDeps(_useStateAct);

  const bubbleRef = useRef<OverlayInstance>(null!);

  const fbSelf = useSelf({
    delayNode: null as ReactElement | null,
    // 延迟更新位置, 防止闪烁
    lastUpdate: null as Function | null,
  });

  const [fbState, setFbState] = useSetState({
    content: null as ReactElement | null,
    open: false,
    // 在已打开状态下, 需要延迟更新content, 否则会导致内容闪动
    delayContent: null as ReactElement | null,
  });

  state.instance.event.feedback.useEvent((e: TableFeedbackEvent[]) => {
    const isClose = e[0]?.type === TableFeedback.close;

    const first = e[0];

    if (isClose || !first) {
      setFbState({ open: false });
      return;
    }

    const content = e.map((item, index) => {
      if (!item.text) return null;

      let node: React.ReactNode = item.text;

      if (item.type === TableFeedback.overflow && item.cell) {
        const arg = renderCommonHandle({
          props,
          state,
          cell: item.cell as TableCellWithDom,
          rcPlugins,
        });

        if (isTruthyOrZero(arg.prevElement)) {
          node = arg.prevElement;
        }
      }

      return (
        // eslint-disable-next-line react/jsx-key
        <>
          <div
            className={clsx(item.type === TableFeedback.error && "color-error")}
            style={{
              maxHeight: 120,
              overflow: "auto",
            }}
          >
            {node}
          </div>
          {index !== e.length - 1 && <Divider margin={4} />}
        </>
      );
    });

    const node = React.createElement(
      "div",
      {
        key: createRandString(), // 防止被判断为相同节点
      },
      ...content
    );

    const lastUpdate = () => {
      if (first.bound) {
        bubbleRef.current.updateTarget(first.bound, true);
      } else if (first.dom) {
        bubbleRef.current.updateTarget(first.dom, true);
      }
    };

    if (!fbState.open) {
      setFbState({ open: true, content: node });
      lastUpdate();
    }

    setFbState({
      content: node,
    });

    fbSelf.lastUpdate = lastUpdate;
  });

  useEffect(() => {
    if (fbSelf.lastUpdate) {
      fbSelf.lastUpdate();
      fbSelf.lastUpdate = null;
    }
  }, [fbState.content]);

  return (
    <Bubble
      style={{ maxWidth: 300 }}
      clickAwayQueue={false}
      direction={OverlayDirection.top}
      arrow={false}
      offset={4}
      open={fbState.open}
      content={fbState.content}
      instanceRef={bubbleRef}
      escapeClosable={false}
    />
  );
}
