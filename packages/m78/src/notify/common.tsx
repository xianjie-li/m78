import { createEvent, useDelayToggle } from "@m78/hooks";
import { useEffect, useMemo, useRef } from "react";
import { config } from "react-spring";
import {
  _Share,
  NotifyPositionUnion,
  NotifyQuicker,
  NotifyState,
} from "./types.js";
import { _notify } from "./notify.js";

/**
 * 一个事件, 用于实现interactive, pos表示触发事件的notify类型, isIn表示是开始触发还是结束触发
 * */
export const _interactiveEvent =
  createEvent<(pos: NotifyPositionUnion, isIn: boolean) => void>();

/** 初始动画值 */
export const _initTransition = {
  height: 0,
  process: 100,
  opacity: 0,
  transform: "scale3d(0.7, 0.7, 0.7)",
  config: config.stiff,
};

/**
 * 添加交互行为, 在聚焦时防止带延迟的同位置notify隐藏
 * */
export function _useInteractive(share: _Share) {
  const { position, open, hasDuration, api } = share;

  const interactiveFlag = useRef<any>();

  /** 发生交互时, 暂停所有同方向的notify */
  _interactiveEvent.useEvent((pos, isIn) => {
    if (!hasDuration || pos !== position || !open) return;

    clearTimeout(interactiveFlag.current);

    if (isIn) {
      // 是否包含为完全显示的notify
      const notShow = api.current
        .map((item) => item.get().opacity)
        .filter((num) => num < 1);

      !notShow.length && api.pause();
    } else {
      interactiveFlag.current = setTimeout(api.resume, 300);
    }
  });

  /** 开始动画 */
  function start() {
    if (!hasDuration || !open) return;
    _interactiveEvent.emit(position, true);
  }

  /** 暂停动画 */
  function stop() {
    if (!hasDuration || !open) return;
    _interactiveEvent.emit(position, false);
  }

  return {
    start,
    stop,
  };
}

/**
 * 根据是否开启了关闭按钮动态设置偏移和边距, 防止关闭按钮遮挡文字
 * */
export function _useFixPad({ props, bound }: _Share) {
  const { title, cancel } = props;

  return useMemo(() => {
    const ob = {
      paddingRight: "18px",
    };

    /* 按钮偏移调整, 用于优化显示效果, 小于50视为单行 */
    const iconOb =
      bound.offsetHeight < 50
        ? {
            top: "10px",
          }
        : undefined;

    const contOb = title ? undefined : ob;

    return [
      {
        title: ob,
        cont: cancel ? contOb : undefined,
      },
      iconOb,
    ] as const;
  }, [cancel, title, bound.height]);
}

/**
 *
 * */
export function _useToggleController(share: _Share) {
  const { open, props, bound, api, hasDuration, duration } = share;

  const dShow = useDelayToggle(open, props.minDuration);

  useEffect(() => {
    if (dShow) {
      showHandle();
    } else {
      hideHandle();
    }
  }, [dShow, bound.height]);

  /**
   * 控制显示动画对应行为
   * */
  function showHandle() {
    api.start({
      to: async (next) => {
        await next({
          height: bound.offsetHeight + 16 /* 上下边距 */,
          process: 100,
          opacity: 1,
          transform: "scale3d(1, 1, 1)",
        });

        if (hasDuration) {
          await next({
            process: 0,
            config: { duration },
          });

          props.onChange(false);
        }
      },
    });
  }

  /**
   * 控制隐藏动画和销毁
   * */
  function hideHandle() {
    api.start({
      ..._initTransition,
      onRest: props.onDispose,
    });
  }

  return dShow;
}

export function _notifyQuickerBuilder(
  status?: NotifyState["status"]
): NotifyQuicker {
  return (content, position) => {
    return _notify.render({
      content,
      position,
      status,
    });
  };
}
