import { COMMON_NS, TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble, BubbleType } from "../../bubble/index.js";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconSave } from "@m78/icons/icon-save.js";
import React, { useRef } from "react";
import { useFn, useSetState } from "@m78/hooks";
import { _injector } from "../table.js";
import { _useStateAct } from "../state.act.js";
import { TableMutationType } from "../../table-vanilla/plugins/mutation.js";
import { IconAddToPhotos } from "@m78/icons/icon-add-to-photos.js";
import { IconDeleteForever } from "@m78/icons/icon-delete-forever.js";
import { Trigger, TriggerEvent, TriggerType } from "../../trigger/index.js";
import { OverlayInstance } from "../../overlay/index.js";
import { _useMethodsAct } from "../methods.act.js";
import { isEmpty } from "@m78/utils";

export function _AddBtn() {
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
          <IconAddToPhotos />
          {t("add row btn")}
        </Button>
      )}
    </Translation>
  );
}

export function _SaveBtn() {
  const stateDep = _injector.useDeps(_useStateAct);
  const props = _injector.useProps();
  const { instance } = stateDep.state;

  const [state, setState] = useSetState({
    newCount: 0,
    removeCount: 0,
    updateCount: 0,
    configChanged: false,
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
      configChanged: instance.getChangedConfigKeys().length > 0,
    });
  }

  const commonNSOpt = {
    ns: COMMON_NS,
  };

  const submit = useFn(() => {
    if (!state.changed || !props.onSubmit) return;

    const d: any = {};

    const data = instance.getData();
    const changedKeys = instance.getChangedConfigKeys();

    if (data.update.length || data.sorted || data.remove.length) {
      d.data = data;
    }

    if (changedKeys.length) {
      d.config = instance.getPersistenceConfig();
      d.changedConfigKeys = changedKeys;
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
              {t("delete tip")}:{" "}
              <span className="color-red bold mr-8">{state.removeCount}</span>
              {t("update tip")}:{" "}
              <span className="color-blue bold">{state.updateCount}</span>
              {(state.configChanged || state.sorted) && (
                <div className="mt-4">
                  {state.configChanged && (
                    <span className="mr-8">
                      {t("conf tip")}:{" "}
                      <span className="color-blue bold">
                        {t("yes", commonNSOpt)}
                      </span>
                    </span>
                  )}
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
            <IconSave />
            {t("save btn")}
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}

export function _DeleteBtn() {
  const { state } = _injector.useDeps(_useStateAct);
  const { instance } = state;

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

  const onDelete = useFn(() => {
    instance.removeRow(state.selectedRows.map((row) => row.key));
  });

  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <>
          <Bubble instanceRef={bubble1} content={t("delete selected rows")} />
          <Bubble
            instanceRef={bubble2}
            content={t("confirm delete")}
            type={BubbleType.confirm}
            onConfirm={onDelete}
          />
          <Trigger
            type={[TriggerType.active, TriggerType.click]}
            onTrigger={trigger}
          >
            <Button
              className="color-second"
              squareIcon
              disabled={state.selectedRows.length === 0}
            >
              <IconDeleteForever />
            </Button>
          </Trigger>
        </>
      )}
    </Translation>
  );
}
