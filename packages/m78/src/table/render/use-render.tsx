import clsx from "clsx";
import { _Toolbar } from "../toolbar/toolbar.js";
import ReactDom from "react-dom";
import { Result } from "../../result/index.js";
import { IllustrationEmpty1, Size } from "../../common/index.js";
import { _CustomRender } from "./use-custom-render.js";
import { _CustomEditRender } from "./use-edit-render.js";
import { Scroll } from "../../scroll/index.js";
import React from "react";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { COMMON_NS, Translation } from "../../i18n/index.js";
import { Spin } from "../../spin/index.js";

export function _useRender() {
  const props = _injector.useProps();
  const {
    state,
    ref,
    scrollRef,
    scrollEvent,
    scrollContRef,
    wrapRef,
    rcPlugins,
  } = _injector.useDeps(_useStateAct);

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
                      icon={<IllustrationEmpty1 height={120} />}
                      title={t("empty")}
                    />
                  )}
                </Translation>
              ),
              state.emptyNode
            )}

          <_CustomRender />
          <_CustomEditRender />

          {/* 插件额外节点渲染 */}
          {React.createElement(
            React.Fragment,
            null,
            ...rcPlugins.map((p) => p.rcExtraRender?.())
          )}
        </>
      )}

      {/* 初始化反馈 */}
      {state.initializing && (
        <Spin full inline text={state.initializingTip} minDuration={0} />
      )}

      {state.blockError && (
        <div className="m78-table_block-error">{state.blockError}</div>
      )}

      <div
        style={props.style}
        className={clsx("m78-table", props.className)}
        ref={ref}
      >
        <Scroll
          className="m78-table_view m78-table_expand-size"
          direction="xy"
          // 手动控制
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
