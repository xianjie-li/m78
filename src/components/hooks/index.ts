import { useEffect, useMemo, useState, useRef } from 'react';
import { createRandString, isArray } from '@lxjx/utils';
import { useUpdateEffect, useUpdate } from 'react-use';
import { useCustomEvent } from '@lxjx/hooks';

interface Item<Meta = any> {
  id: string;
  meta: Meta;
}

interface Same {
  [key: string]: Array<Item>;
}

const sameMap: Same = {};

/**
 * 一般用于对同类组件进行管理，获取其他同类组件的共享数据以及当前处在启用实例中的位置
 * 这个hook被内部用于
 * - 获取Modal组件的实例关系，动态的覆盖设置zIndex，隐藏多余的mask
 * - 处理Drawer组件的zIndex、mask等状态
 * @param key - 用于保存该组件在示例信息中状态的唯一key
 * @param dep - 只有在dep的值为true时，该实例才算启用并被钩子接受
 * @param meta - 用于共享的组件源数据，可以在同组件的其他实例中获取到
 * @return zIndex[0] - 该组件实例处于所有示例中的第几位，未启用的组件返回-1
 * @return zIndex[1] - 所有启用状态的组件<Item>组成的数组，正序
 * @return zIndex[2] - 该组件实例的唯一标识
 * */
export function useSame<Meta = any>(key: string, dep: boolean, meta?: Meta) {
  const id = useMemo(() => createRandString(2), []);
  const [cIndex, setCIndex] = useState(depChangeHandel);

  /* 在某个组件更新了sameMap后，需要通知其他相应的以最新状态更新组件 */
  const update = useUpdate();
  const eventKey = `${key}_custom_event`;

  const emitUpdate = useCustomEvent(eventKey, (_id: string) => {
    if (_id === id) return;
    update();
  }, []);

  setCurrentMeta(meta);

  /* 获取当前实例在实例组中的索引或添加当前实例到实例组中，未启用组件索引返回-1 */
  function depChangeHandel() {
    const [current, index] = getCurrent();

    // 执行后续操作前，先移除已有实例
    if (index !== -1) {
      current.splice(index, 1);
    }

    // 当依赖值为true时才添加实例到组中
    if (dep) {
      sameMap[key].push({
        id,
        meta: {},
      });
    }

    // 从更新后的实例组中获取当前索引
    const [, newIndex] = getCurrent();

    return newIndex;
  }

  /* dep改变时。更新索引信息 */
  useUpdateEffect(() => {
    setCIndex(depChangeHandel());
  }, [dep]);

  /* cIndex变更时，通知其他钩子进行更新 */
  useUpdateEffect(() => {
    emitUpdate(eventKey, id);
  }, [cIndex]);

  /**
   * 获取当前组件在sameMap中的实例组和该组件在实例中的索引并确保sameMap[key]存在
   * @return meta[0] - 该组件实例组成的数组
   * @return meta[1] - 当前组件在实例中的位置
   * */
  function getCurrent() {
    // 无实例存在时赋初始值
    if (!isArray(sameMap[key])) {
      sameMap[key] = [];
    }

    // 取所在索引
    const index = sameMap[key].findIndex(item => item.id === id);

    return [sameMap[key], index] as const;
  }

  /* 设置当前实例的meta状态 */
  function setCurrentMeta(_meta?: Meta) {
    if (typeof _meta === 'undefined') return;

    const [current, index] = getCurrent();

    if (index !== -1) {
      current[index].meta = _meta;
    }
  }

  /* 在sameMap[key]长度改变时更新 */
  useEffect(() => {
    const [, newIndex] = getCurrent();
    if (newIndex !== cIndex) {
      setCIndex(newIndex);
    }
    // eslint-disable-next-line
  }, [sameMap[key]?.length]);

  return [cIndex, sameMap[key], id] as [number, Array<Item<Meta>>, string];
}


export function usePrev<T = any>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
