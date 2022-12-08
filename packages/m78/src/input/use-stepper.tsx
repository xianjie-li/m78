import { _InputContext } from "./types.js";
import { Button } from "../button/index.js";
import { Size } from "../common/index.js";
import { IconRemove } from "@m78/icons/icon-remove.js";
import { IconAdd } from "@m78/icons/icon-add.js";
import React from "react";
import { useDrag, Handler } from "@use-gesture/react";
import { isBoolean } from "@m78/utils";
import { useFn, useSelf, useDestroy } from "@m78/hooks";

const LONG_PRESS_TRIGGER_DELAY = 800;

type HandleCreate = (isInc: boolean) => Handler<"drag", any>;

export function _useStepper(ctx: _InputContext) {
  const { props } = ctx;

  const ins = useSelf({
    /** 长按自增/减计时器 */
    stepperTimer: null as any,
  });

  useDestroy(() => {
    clearTimeout(ins.stepperTimer);
  });

  const handleCreate: HandleCreate =
    (isInc: boolean) =>
    ({ first, down, memo }) => {
      if (first && down) {
        auto(isInc);
        return true;
      }

      if (!down && memo) {
        clearTimeout(ins.stepperTimer);
      }
    };

  const incBind = useDrag(handleCreate(false), {
    delay: LONG_PRESS_TRIGGER_DELAY,
  });

  const subBind = useDrag(handleCreate(true), {
    delay: LONG_PRESS_TRIGGER_DELAY,
  });

  /** 步进操作 */
  const stepHandle = useFn((isInc: boolean) => {
    if (!props.stepper) return;

    const stepNum = isBoolean(props.stepper) ? 1 : props.stepper;
    const num = Number(ctx.value);

    if (isNaN(num)) {
      console.warn("Invalid value entered, operation ignored");
      return;
    }

    ctx.manualChange(String(isInc ? num + stepNum : num - stepNum));
  });

  function auto(inc: boolean) {
    clearTimeout(ins.stepperTimer);

    ins.stepperTimer = setTimeout(() => {
      stepHandle(inc);
      auto(inc);
    }, 80);
  }

  return (
    <div className="m78-input_icon">
      <Button
        squareIcon
        outline
        disabled={ctx.isDisabled}
        onClick={() => stepHandle(false)}
        {...incBind()}
      >
        <IconRemove></IconRemove>
      </Button>
      <Button
        squareIcon
        outline
        disabled={ctx.isDisabled}
        onClick={() => stepHandle(true)}
        {...subBind()}
      >
        <IconAdd></IconAdd>
      </Button>
    </div>
  );
}
