import React, {
  ReactElement,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  TriggerInstance,
  TriggerConfig,
  TriggerEvent,
  TriggerTargetMeta,
  TriggerType,
} from "./types.js";
import { useFn, useSetState } from "@m78/hooks";
import { createTrigger } from "./index.js";
import { AnyFunction, AnyObject, dumpFn, ensureArray } from "@m78/utils";

export interface UseTriggerProps {
  /** 需要绑定的事件类型 */
  type: TriggerType | TriggerType[];
  /** 事件目标元素, 其渲染结果必须是单个dom节点, 文本或多个dom会导致事件监听异常 */
  element?: ReactElement;
  /** 触发回调 */
  onTrigger?: (e: TriggerEvent) => void;
  /** 控制事件项的active事件行为 */
  active?: TriggerConfig["active"];

  /** trigger对应的dom节点的ref */
  innerRef?: React.Ref<HTMLElement | null>;
  /** 传入时, 会以该key创建单独创建一个trigger实例, 相同key的trigger会共用一个实例, 默认情况下, 会使用内部的默认实例 */
  instanceKey?: string;
}

export interface TriggerProps extends Omit<UseTriggerProps, "element"> {
  /** 事件目标元素, 其渲染结果必须是单个dom节点, 文本或多个dom会导致事件监听异常 */
  children: UseTriggerProps["element"];
}

/** 实例池 */
const instances: Record<string, TriggerInstance> = {};

const DEFAULT_INSTANCE_KEY = "__default__";

const allType = [
  TriggerType.click,
  TriggerType.active,
  TriggerType.drag,
  TriggerType.focus,
  TriggerType.contextMenu,
  TriggerType.move,
];

/** 通过hooks便捷的绑定trigger实例, 未识别的props会传递到事件对象的context属性 */
export function _useTrigger(props: UseTriggerProps & AnyObject) {
  const {
    type,
    element,
    onTrigger,
    active,
    innerRef,
    instanceKey = DEFAULT_INSTANCE_KEY,
    ...other
  } = props;

  const [meta, setMeta] = useSetState<Partial<TriggerTargetMeta>>({
    active,
  });

  const [state, setState] = useSetState({
    instance: null as TriggerInstance | null,
  });

  // 暴露内部dom
  useImperativeHandle(innerRef, () => meta.target as HTMLElement, [
    meta.target,
  ]);

  // 用于快速确认指定事件是否启用
  const typeMap = useMemo(() => {
    const ls = ensureArray(type);
    const obj = {} as Record<string, boolean>;
    ls.forEach((key) => {
      obj[key] = true;
    });
    return obj;
  }, [type]);

  // 统一事件派发
  const handle = useFn((e: TriggerEvent) => {
    if (!typeMap[e.type] || e.target !== meta) return;
    e.data = e.target;
    e.target = (e.target as TriggerTargetMeta).target;
    e.context = other;
    onTrigger?.(e);
  });

  // 关联或创建trigger实例
  useEffect(() => {
    const ins =
      instances[instanceKey] ||
      createTrigger({
        target: [],
        type: allType,
      });

    ins.event.on(handle);

    instances[instanceKey] = ins;

    setState({
      instance: ins,
    });

    return () => {
      ins.event.off(handle);
    };
  }, []);

  // 添加target到实例
  useEffect(() => {
    if (!meta.target || !state.instance) return;

    state.instance.add(meta as TriggerTargetMeta);

    return () => {
      state.instance!.delete(meta as TriggerTargetMeta);
    };
  }, [meta.target, state.instance]);

  // 通过ref测量element实际渲染的dom
  const refCallback = useFn((node) => {
    if (!node) return;

    if (meta.target !== node.nextSibling) {
      setMeta({
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

  return {
    node: (
      <>
        {React.isValidElement(element) && (
          <span
            style={{ display: "none" }}
            ref={refCallback}
            // 这里key是为了强制每次render时都让react重绘span, 因为我们每次成功拿到element
            // 渲染的dom后就会删除掉该span节点来避免对用户dom结构的破坏
            // 而react是不知道其已经被删除的, 我们后续测量就会失效, (因为span只存在内存中, span.nextSibling)
            key={String(Math.random())}
          />
        )}
        {element}
      </>
    ),
    el: (meta.target as HTMLElement) || null,
  };
}

/** 通过组件便捷的绑定trigger实例, 未识别的props会传递到事件对象的context属性 */
export function _Trigger(props: TriggerProps & AnyObject) {
  const trigger = _useTrigger({
    ...props,
    element: props.children,
    children: undefined,
  } as TriggerProps);

  return trigger.node;
}

_Trigger.displayName = "Trigger";
