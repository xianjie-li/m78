import clsx from "clsx";
import { _Toolbar } from "../toolbar/toolbar.js";
import ReactDom from "react-dom";
import { Result } from "../../result/index.js";
import { IllustrationEmpty1, Size } from "../../common/index.js";
import { IconFolderOpen } from "@m78/icons/folder-open.js";
import { _CustomRender } from "./use-custom-render.js";
import { _CustomEditRender } from "./use-edit-render.js";
import { Scroll } from "../../scroll/index.js";
import React from "react";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { COMMON_NS, Translation } from "../../i18n/index.js";
import { _useContextMenuAct } from "../context-menu/use-context-menu.act.js";
import { AnyFunction } from "@m78/utils";

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

  const ctxMenu = _injector.useDeps(_useContextMenuAct);

  // 内部引用了ctxMenu.node, 避免递归引用导致类型丢失
  const renderTrigger = ctxMenu.renderTrigger as AnyFunction;

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

          {ctxMenu.node}
        </>
      )}

      {renderTrigger(
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
      )}
    </div>
  );
}