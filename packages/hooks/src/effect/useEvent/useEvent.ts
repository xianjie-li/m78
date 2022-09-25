import { useFn } from "../../";
import { useEffect } from "react";
import { AnyFunction, CustomEvent, createEvent as create } from "@m78/utils";

export interface CustomEventWithHook<Listener extends AnyFunction>
  extends CustomEvent<Listener> {
  useEvent(listener: Listener): void;
}

/** 增强一个现有事件对象 */
export function enhance<Listener extends AnyFunction = AnyFunction>(
  event: CustomEvent<Listener>
): CustomEventWithHook<Listener> {
  const useEvent = (listener: Listener) => {
    const memoHandle = useFn(listener);

    useEffect(() => {
      event.on(memoHandle);

      return () => event.off(memoHandle);
    }, []);
  };

  return Object.assign(event, {
    useEvent,
  });
}

/**
 * 自定义事件，用于多个组件间或组件外进行通讯
 * */
function createEvent<Listener extends AnyFunction = AnyFunction>() {
  return enhance<Listener>(create<Listener>());
}

createEvent.enhance = enhance;

export { createEvent };
