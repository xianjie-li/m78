import React, { useRef, useState } from "react";
import { TableCell } from "../../../table-vanilla/index.js";
import { Button } from "../../../button/index.js";
import { Size } from "../../../common/index.js";
import { IconFilter } from "@m78/icons/filter.js";
import { Bubble, BubbleType } from "../../../bubble/index.js";
import { OverlayDirection, OverlayInstance } from "../../../overlay/index.js";
import { useFn } from "@m78/hooks";
import clsx from "clsx";
import { TABLE_NS, Translation } from "../../../i18n/index.js";
import { IconRefresh } from "@m78/icons/refresh.js";
import { IconFind } from "@m78/icons/find.js";
import { Trigger, TriggerEvent, TriggerType } from "../../../trigger/index.js";
import { _injector } from "../../table.js";
import { _FilterBtnCommon } from "./filter-render.js";
import { _useFilterFormAct } from "./use-filter-form.act.js";

/** 工具栏查询按钮 */
export function _ToolBarQueryBtn() {
  const { form } = _injector.useDeps(_useFilterFormAct);

  return (
    <Button
      text
      onClick={() => {
        return form.submit();
      }}
    >
      <IconFind className="fs-16" />
      <Translation ns={TABLE_NS}>{(t) => t("query")}</Translation>
    </Button>
  );
}

/** 工具栏重置按钮 */
export function _ToolBarFilterBtn() {
  const { form } = _injector.useDeps(_useFilterFormAct);

  const [changed, setChanged] = useState(false);

  form.events.change.useEvent(() => {
    const c = form.getFormChanged();
    if (changed !== c) {
      setChanged(c);
    }
  });

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble content={t("reset filter")}>
          <Button
            disabled={!changed}
            squareIcon
            onClick={() => {
              form.reset();
            }}
          >
            <IconRefresh />
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}

/** 表头右侧的字段筛选按钮 */
export const _FilterBtn = React.memo(
  ({
    cell,
  }: {
    // 当前单元格
    cell: TableCell;
  }) => {
    const column = cell.column;

    return (
      <_FilterBtnCommon render={column.config.filterRender} isToolbar={false}>
        {({ state, setState, renderContent }) => (
          <Bubble
            open={state.open}
            onChange={(open) => setState({ open })}
            type={BubbleType.popper}
            direction={OverlayDirection.bottom}
            content={renderContent()}
            autoFocus
          >
            <Button size={Size.small} squareIcon>
              <IconFilter
                theme={state.changed ? "filled" : "outline"}
                className={clsx("fs-12", state.changed && "color")}
              />
            </Button>
          </Bubble>
        )}
      </_FilterBtnCommon>
    );
  }
);

/** 工具栏公共筛选按钮 */
export function _ToolbarCommonFilterBtn() {
  const props = _injector.useProps();

  const bubble1 = useRef<OverlayInstance>(null!);
  const bubble2 = useRef<OverlayInstance>(null!);

  // bubble触发器
  const trigger = useFn((e: TriggerEvent) => {
    if (e.type === TriggerType.active) {
      bubble1.current.trigger(e);
    }

    if (e.type === TriggerType.click) {
      bubble2.current.trigger(e);
    }
  });

  if (!props.commonFilter) return null;

  return (
    <_FilterBtnCommon render={props.commonFilter} isToolbar={true}>
      {({ state, setState, renderContent }) => (
        <Translation ns={TABLE_NS}>
          {(t) => (
            <>
              <Bubble instanceRef={bubble1} content={t("common filter")} />
              <Bubble
                instanceRef={bubble2}
                content={renderContent()}
                type={BubbleType.popper}
                direction={OverlayDirection.bottomStart}
                autoFocus
                open={state.open}
                onChange={(open) => setState({ open })}
              />
              <Trigger
                type={[TriggerType.active, TriggerType.click]}
                onTrigger={trigger}
              >
                <Button squareIcon>
                  <IconFilter
                    theme={state.changed ? "filled" : "outline"}
                    className={clsx(state.changed && "color")}
                  />
                </Button>
              </Trigger>
            </>
          )}
        </Translation>
      )}
    </_FilterBtnCommon>
  );
}
