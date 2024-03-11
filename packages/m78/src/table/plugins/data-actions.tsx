import { COMMON_NS, TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconSaveOne } from "@m78/icons/save-one.js";
import React, { useRef } from "react";
import { useFn, useSetState } from "@m78/hooks";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { TableMutationType } from "../../table-vanilla/index.js";
import { IconAdd } from "@m78/icons/add.js";
import { IconDeleteOne } from "@m78/icons/delete-one.js";
import { Trigger, TriggerEvent, TriggerType } from "../../trigger/index.js";
import { OverlayInstance } from "../../overlay/index.js";
import { _useMethodsAct } from "../injector/methods.act.js";
import { isEmpty } from "@m78/utils";
import { RCTablePlugin } from "../plugin.js";
import { Divider } from "../../layout/index.js";

export class _DataActionPlugin extends RCTablePlugin {
  toolbarTrailingCustomer(nodes: React.ReactNode[]) {
    const { dataOperations: conf } = this.getDeps(_useStateAct);

    const newNodes: React.ReactNode[] = [];

    if (conf.delete) newNodes.push(<DeleteBtn />);

    if (conf.add) newNodes.push(<AddBtn />);

    if (conf.delete || conf.add) newNodes.push(<SaveBtn />);

    if (newNodes.length) nodes.push(<Divider vertical />, ...newNodes);
  }
}

function AddBtn() {
  const { state } = _injector.useDeps(_useStateAct);
  const methods = _injector.useDeps(_useMethodsAct);
  const { instance } = state;

  const add = useFn(() => {
    instance.addRow(methods.getDefaultNewData());
  });

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Button size={Size.small} onClick={add}>
          <IconAdd />
          {t("add row btn")}
        </Button>
      )}
    </Translation>
  );
}

function SaveBtn() {
  const stateDep = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();
  const { instance } = stateDep.state;

  const [state, setState] = useSetState({
    newCount: 0,
    removeCount: 0,
    updateCount: 0,
    sorted: false,
    changed: false,
  });

  instance.event.mutation.useEvent((e) => {
    if (
      e.type === TableMutationType.config ||
      e.type === TableMutationType.data
    ) {
      setState({
        changed: instance.getTableChanged(),
      });
    }
  });

  instance.event.interactiveChange.useEvent((cell, show, isSubmit) => {
    if (isSubmit) {
      setState({
        changed: instance.getTableChanged(),
      });
    }
  });

  function updateCount() {
    const data = instance.getData();

    setState({
      newCount: data.add.length,
      removeCount: data.remove.length,
      updateCount: data.change.length,
      sorted: data.sorted,
    });
  }

  const commonNSOpt = {
    ns: COMMON_NS,
  };

  const submit = useFn(() => {
    if (!state.changed || !props.onSubmit) return;

    const d: any = {};

    const data = instance.getData();

    if (data.update.length || data.sorted || data.remove.length) {
      d.data = data;
    }
    if (isEmpty(d)) return;

    props.onSubmit(d);
  });

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble
          style={{ maxWidth: 500 }}
          content={
            <div>
              {t("new tip")}:{" "}
              <span className="color-green bold mr-8">{state.newCount}</span>
              {t("remove tip")}:{" "}
              <span className="color-red bold mr-8">{state.removeCount}</span>
              {t("update tip")}:{" "}
              <span className="color-blue bold">{state.updateCount}</span>
              {state.sorted && (
                <div className="mt-4">
                  {state.sorted && (
                    <span>
                      {t("sorted tip")}:{" "}
                      <span className="color-blue bold">
                        {t("yes", commonNSOpt)}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          }
          onChange={(open) => {
            if (open) updateCount();
          }}
        >
          <Button
            size={Size.small}
            color={ButtonColor.primary}
            disabled={!state.changed}
            onClick={submit}
          >
            <IconSaveOne />
            {t("save btn")}
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}

function DeleteBtn() {
  const { state } = _injector.useDeps(_useStateAct);
  const { instance } = state;

  const bubble1 = useRef<OverlayInstance>(null!);

  // bubble触发器
  const trigger = useFn((e: TriggerEvent) => {
    if (e.type === TriggerType.active) {
      bubble1.current.trigger(e);
    }
  });

  const onDelete = useFn(() => {
    instance.softRemove(state.selectedRows.map((row) => row.key));
  });

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <>
          <Bubble instanceRef={bubble1} content={t("remove rows")} />
          <Trigger type={[TriggerType.active]} onTrigger={trigger}>
            <Button
              squareIcon
              disabled={state.selectedRows.length === 0}
              onClick={onDelete}
            >
              <IconDeleteOne />
            </Button>
          </Trigger>
        </>
      )}
    </Translation>
  );
}
