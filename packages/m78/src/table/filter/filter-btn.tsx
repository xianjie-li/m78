import React, { useEffect, useRef, useState } from "react";
import { _RCTableContext } from "../types.js";
import { TableCell } from "../../table-vanilla/index.js";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconFilterAlt } from "@m78/icons/icon-filter-alt.js";
import { Bubble, BubbleType } from "../../bubble/index.js";
import { OverlayDirection, OverlayInstance } from "../../overlay/index.js";
import { Row } from "../../layout/index.js";
import { SetState, useFn, useSelf, useSetState } from "@m78/hooks";
import clsx from "clsx";
import { FieldDetector, FormInstance } from "../../form/index.js";
import { getNamePathValue, NamePath } from "@m78/utils";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { IconSync } from "@m78/icons/icon-sync.js";
import { IconManageSearch } from "@m78/icons/icon-manage-search.js";
import { Trigger, TriggerEvent, TriggerType } from "../../trigger/index.js";
import { _useStateAct } from "../state.act.js";
import { _injector } from "../table.js";
import { InjectType } from "../../injector/index.js";

/** 工具栏查询按钮 */
export function _renderToolBarQueryBtn(
  stateDep: InjectType<typeof _useStateAct>
) {
  return (
    <Button
      text
      onClick={() => {
        return stateDep.filterForm.submit();
      }}
    >
      <IconManageSearch className="color-second fs-16" />
      <Translation ns={TABLE_NS}>{(t) => t("query")}</Translation>
    </Button>
  );
}

/** 工具栏重置按钮 */
export function _ToolBarFilterBtn() {
  const stateDep = _injector.useDeps(_useStateAct);

  const [changed, setChanged] = useState(false);

  stateDep.filterForm.events.change.useEvent(() => {
    const c = stateDep.filterForm.getFormChanged();
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
              stateDep.filterForm.reset();
            }}
          >
            <IconSync className="color-second" />
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
            <Button className="color-second" size={Size.small} squareIcon>
              <IconFilterAlt
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
export function _ToolbarCommonFilter() {
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
                  <IconFilterAlt
                    className={clsx("color-second", state.changed && "color")}
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

/** 通用筛选弹层渲染逻辑 */
export const _FilterBtnCommon = ({
  render,
  isToolbar,
  children,
}: {
  // 渲染器
  render?: (form: FormInstance) => React.ReactNode;
  // 是否为toolbar筛选, 部分表现会有差异
  isToolbar?: boolean;
  // 自定义子级渲染
  children: (arg: {
    state: { open: boolean; changed: boolean };
    setState: SetState<{ open: boolean; changed: boolean }>;
    renderContent: () => JSX.Element;
  }) => React.ReactElement;
}) => {
  const actState = _injector.useDeps(_useStateAct);

  const self = useSelf({
    // 检测子级field
    names: [] as NamePath[],
  });

  const [state, setState] = useSetState({
    open: false,
    // 是否变更
    changed: false,
  });

  useEffect(() => {
    actState.state.instance.isActive(!state.open);
  }, [state.open]);

  if (!render) return null;

  const formNodes = render(actState.filterForm);

  if (!formNodes) return null;

  // 滚动时关闭
  actState.scrollEvent.useEvent(() => {
    if (state.open && !isToolbar) setState({ open: false });
  });

  // 检测变更
  actState.filterForm.events.change.useEvent(() => {
    const changed = self.names.some((n) => {
      return actState.filterForm.getChanged(n);
    });

    if (changed !== state.changed) {
      setState({
        changed,
      });
    }
  });

  const reset = useFn(async () => {
    const defValue = actState.filterForm.getDefaultValues();

    self.names.forEach((name) => {
      actState.filterForm.setValue(name, getNamePathValue(defValue, name));
    });

    try {
      await actState.filterForm.submit();
      setState({ open: false });
    } catch (e) {
      //
    }
  });

  const query = useFn(async () => {
    try {
      await actState.filterForm.submit();
      setState({ open: false });
    } catch (e) {
      //
    }
  });

  const enterDown = useFn((e: React.KeyboardEvent) => {
    if (
      e.code === "Enter" &&
      state.changed &&
      (e.target as HTMLElement).tagName !== "BUTTON"
    ) {
      query();
    }
  });

  function renderContent() {
    return (
      <div onKeyDown={enterDown}>
        <FieldDetector
          onChange={(names) => {
            self.names = names;
          }}
        >
          {formNodes}
        </FieldDetector>

        <Translation ns={TABLE_NS}>
          {(t) => (
            <Row className="mt-16" mainAlign="end">
              <Button size={Size.small} onClick={reset}>
                {t("reset")}
              </Button>
              <Button
                size={Size.small}
                color={ButtonColor.primary}
                onClick={query}
              >
                {t("query")}
              </Button>
            </Row>
          )}
        </Translation>
      </div>
    );
  }

  const arg = {
    state,
    setState,
    renderContent,
  };

  return children(arg);
};
