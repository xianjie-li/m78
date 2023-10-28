import { FieldDetector, FormInstance } from "../../../form/index.js";
import React, { useEffect } from "react";
import { SetState, useFn, useSelf, useSetState } from "@m78/hooks";
import { _injector } from "../../table.js";
import { _useStateAct } from "../../injector/state.act.js";
import { _useMethodsAct } from "../../injector/methods.act.js";
import { getNamePathValue, NamePath } from "@m78/utils";
import { TABLE_NS, Translation } from "../../../i18n/index.js";
import { Row } from "../../../layout/index.js";
import { Button, ButtonColor } from "../../../button/index.js";
import { Size } from "../../../common/index.js";
import { _useFilterFormAct } from "./use-filter-form.act.js";

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
  const methods = _injector.useDeps(_useMethodsAct);
  const { form } = _injector.useDeps(_useFilterFormAct);

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
    methods.overlayStackChange(state.open);
  }, [state.open]);

  if (!render) return null;

  const formNodes = render(form);

  if (!formNodes) return null;

  // 滚动时关闭
  actState.scrollEvent.useEvent(() => {
    if (state.open && !isToolbar) setState({ open: false });
  });

  // 检测变更
  form.events.change.useEvent(() => {
    const changed = self.names.some((n) => {
      return form.getChanged(n);
    });

    if (changed !== state.changed) {
      setState({
        changed,
      });
    }
  });

  const reset = useFn(async () => {
    const defValue = form.getDefaultValues();

    self.names.forEach((name) => {
      form.setValue(name, getNamePathValue(defValue, name));
    });

    try {
      await form.submit();
      setState({ open: false });
    } catch (e) {
      //
    }
  });

  const query = useFn(async () => {
    try {
      await form.submit();
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
