import { animated } from "react-spring";
import React from "react";
import { keypressAndClick } from "@m78/utils";
import clsx from "clsx";
import { _WineContext, WineInstance, WineState } from "./types";
import { _Methods } from "./useMethods";

/** 渲染内置顶栏 */
export const renderBuiltInHeader: NonNullable<WineState["headerCustomer"]> = (
  props,
  state,
  instance,
  isFull
) => {
  return (
    <div
      className="m78-wine_header"
      {...props}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="m78-wine_header-content">{state.header}</div>
      <div
        className="m78-wine_header-actions"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span
          tabIndex={0}
          className="m78-wine_btn"
          role="button"
          aria-label="hide modal"
          {...keypressAndClick(() => state.onChange?.(false))}
        >
          <span className="m78-wine_hide-btn" />
        </span>
        {isFull && (
          <span
            tabIndex={0}
            className="m78-wine_btn"
            role="button"
            aria-label="minimize modal"
            {...keypressAndClick(instance.resize)}
          >
            <span className="m78-wine_resize-btn" />
          </span>
        )}
        {!isFull && (
          <span
            tabIndex={0}
            className="m78-wine_btn"
            role="button"
            aria-label="maximize modal"
            {...keypressAndClick(instance.full)}
          >
            <span className="m78-wine_max-btn" />
          </span>
        )}
        <span
          tabIndex={0}
          className="m78-wine_btn __warning"
          role="button"
          aria-label="close modal"
          {...keypressAndClick(state.onDispose!)}
        >
          <span className="m78-wine_dispose-btn" />
        </span>
      </div>
    </div>
  );
};

/** 渲染主内容 */
export function render(
  ctx: _WineContext,
  methods: _Methods,
  instance: WineInstance
) {
  const { state, insideState } = ctx;
  const { resize, full, top } = methods;

  const headerCustomer = state.headerCustomer || renderBuiltInHeader;

  return (
    <animated.div
      style={{
        ...state.style,
        zIndex: insideState.isTop ? state.zIndex + 1 : state.zIndex,
        ...(ctx.spProps as any),
      }}
      className={clsx("m78-wine", state.className, {
        __full: insideState.isFull,
        __active: insideState.isTop,
      })}
      ref={ctx.wrapElRef}
      onTouchStart={top}
      onMouseDown={top}
      tabIndex={-1}
      role="dialog"
      aria-modal
    >
      {/* decorate这一层用来添加背景、边框，最主要的目的是达到能在根级放一些可以超出根元素的节点而不受overflow影响 */}
      <div className="m78-wine_decorate">
        {headerCustomer(
          {
            ref: ctx.headerElRef,
            onDoubleClick: () => (insideState.isFull ? resize() : full()),
          },
          state,
          instance,
          insideState.isFull!
        )}

        <div
          className="m78-wine_content m78-wine_scrollbar"
          style={{
            top: insideState.headerHeight,
          }}
          key={insideState.refreshKey}
        >
          <React.Fragment>{state.content}</React.Fragment>
        </div>
      </div>
      <div className="m78-wine_drag-line-l" ref={ctx.dragLineLRef} />
      <div className="m78-wine_drag-line-t" ref={ctx.dragLineTRef} />
      <div className="m78-wine_drag-line-r" ref={ctx.dragLineRRef} />
      <div className="m78-wine_drag-line-b" ref={ctx.dragLineBRef} />
      <div className="m78-wine_drag-line-rb" ref={ctx.dragLineRBRef} />
      <div className="m78-wine_drag-line-lb" ref={ctx.dragLineLBRef} />
      <div className="m78-wine_drag-line-lt" ref={ctx.dragLineLTRef} />
      <div className="m78-wine_drag-line-rt" ref={ctx.dragLineRTRef} />
    </animated.div>
  );
}
