import React, { useImperativeHandle, useMemo, type ReactElement } from "react";
import { type TriggerOption, type TriggerListener } from "./types.js";
import { useFn, useSelf, useSetState } from "@m78/hooks";
import { trigger } from "./index.js";
import { dumpFn, type AnyFunction, type AnyObject } from "@m78/utils";

export interface TriggerProps
  extends Omit<TriggerOption, "handler" | "target"> {
  /** 事件处理程序 */
  onTrigger: TriggerListener;
  /** 事件目标元素, 其渲染结果必须是单个非文本的dom节点, 否则会导致事件监听点异常  */
  element?: ReactElement;
  /** 与element完全相同, 用于兼容react命名风格 */
  children?: ReactElement;
  /** trigger对应的dom节点的ref */
  innerRef?: React.Ref<HTMLElement | null>;
}

/** 通过hooks便捷的绑定trigger实例 */
export function _useTrigger(props: TriggerProps) {
  const { onTrigger, element, children, innerRef, ...options } = props;

  const [state, setState] = useSetState({
    target: null as TriggerOption["target"] | null,
  });

  const self = useSelf({
    registered: false,
  });

  // 组装进行注册的事件选项
  const option = useMemo(() => ({} as TriggerOption), []);

  Object.assign(option, options, {
    handler: onTrigger,
    target: state.target,
  } as Partial<TriggerOption>);

  // 暴露内部dom到ref
  useImperativeHandle(innerRef, () => state.target as HTMLElement, [
    state.target,
  ]);

  const bind = useFn(() => {
    if (!option.target || self.registered) return;
    self.registered = true;
    trigger.on(option);
  });

  const unbind = useFn(() => {
    self.registered = false;
    trigger.off(option);
  });

  // 通过ref测量element实际渲染的dom
  const refCallback = useFn((node) => {
    if (!node) return;

    if (state.target !== node.nextSibling) {
      option.target = node.nextSibling || null;

      if (option.target) bind();
      else unbind();

      setState({
        target: node.nextSibling,
      });
    }

    // 从dom中删除测量节点
    if (node && node.parentNode) {
      const parentNode = node.parentNode;

      const back: AnyFunction = parentNode.removeChild.bind(parentNode);

      // 直接删除节点会导致react-refresh等刷新节点时报错, 所以需要添加一些补丁代码进行处理, 减少对dom树的破坏
      // 主要是为了使兄弟级的css选择器(~ +等)能保持正常运行
      // parentNode.appendChild(n);
      parentNode.removeChild = (...arg: any) => {
        try {
          back(...arg);
        } catch (e) {
          dumpFn(e);
        }
      };

      parentNode.removeChild(node);
    }
  });

  function renderNode() {
    const _element: ReactElement | undefined = element || children;

    if (!React.isValidElement(_element)) return null;

    return (
      <>
        <span
          style={{ display: "none" }}
          ref={refCallback}
          // 这里key是为了强制每次render时都让react重绘span, 因为我们每次成功拿到element
          // 渲染的dom后就会删除掉该span节点来避免对用户dom结构的破坏
          // 而react是不知道其已经被删除的, 我们后续测量就会失效, (因为span只存在内存中, span.nextSibling)
          key={String(Math.random())}
        />
        {_element}
      </>
    );
  }

  return {
    node: renderNode(),
    el: (state.target as HTMLElement) || null,
  };
}

/** 通过组件的形式便捷的绑定trigger实例 */
export function _Trigger(props: TriggerProps & AnyObject) {
  const trigger = _useTrigger(props);

  return trigger.node;
}

_Trigger.displayName = "Trigger";
