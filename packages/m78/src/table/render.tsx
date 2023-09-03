import clsx from "clsx";
import { _Toolbar } from "./toolbar/toolbar.js";
import ReactDom from "react-dom";
import { Result } from "../result/index.js";
import { Size } from "../common/index.js";
import { IconDrafts } from "@m78/icons/icon-drafts.js";
import { _CustomRender } from "./use-custom-render.js";
import { _CustomEditRender } from "./use-edit-render.js";
import { _Feedback } from "./feedback.js";
import { Scroll } from "../scroll/index.js";
import React from "react";
import { _useStateAct } from "./state.act.js";
import { _injector } from "./table.js";
import { COMMON_NS, Translation } from "../i18n/index.js";

export function _useRender() {
  const props = _injector.useProps();
  const { state, ref, scrollRef, scrollEvent, scrollContRef, wrapRef } =
    _injector.useDeps(_useStateAct);

  return (
    <div
      className={clsx("m78-table_wrap", props.wrapClassName)}
      style={props.wrapStyle}
      tabIndex={0}
      ref={wrapRef}
    >
      {state.instance && (
        <>
          <_Toolbar />

          {state.emptyNode &&
            ReactDom.createPortal(
              props.emptyNode || (
                <Translation ns={COMMON_NS}>
                  {(t) => (
                    <Result
                      size={Size.small}
                      icon={<IconDrafts className="color-disabled" />}
                      title={t("empty")}
                    />
                  )}
                </Translation>
              ),
              state.emptyNode
            )}

          <_CustomRender />
          <_CustomEditRender />
          <_Feedback />
        </>
      )}

      <div
        style={props.style}
        className={clsx("m78-table", props.className)}
        ref={ref}
      >
        <Scroll
          className="m78-table_view m78-table_expand-size"
          direction="xy"
          disabledScroll
          innerWrapRef={scrollRef}
          miniBar
          scrollIndicator={false}
          onScroll={scrollEvent.emit}
        >
          <div ref={scrollContRef} />
        </Scroll>
      </div>
    </div>
  );
}
