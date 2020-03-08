import { AnyObject } from '../types/types';
import { useEffect, useMemo, useState } from 'react';
import { createRandString, isArray } from '@lxjx/utils';
import { useUpdateEffect } from 'react-use';

const zIndexMap: AnyObject = {};

/**
 * 对弹层组件的层级进行管理，用于确保最新出现的弹层层级高于前面的层级
 * @param key - 用于存储元信息的key
 * @param initZIndex - 基础层级，返回的层级会加上此基础层级
 * @param dep - 弹层组件的开关依赖，也就是用于控制弹层显示、隐藏的prop
 * @return zIndex[0] - 可直接使用的zIndex数字
 * @return zIndex[1] - 该组件当前位于所有出现实例的第几位
 * */
export function useZIndex(key: string, initZIndex: number, dep: boolean) {
  const id = useMemo(() => createRandString(2), []);
  const [zIndex, setZIndex] = useState(depChangeHandel);

  function depChangeHandel() {
    if (!isArray(zIndexMap[key])) {
      zIndexMap[key] = [];
    }

    const index = zIndexMap[key].indexOf(id);

    if (index !== -1) {
      zIndexMap[key].splice(index, 1);
    }

    if (dep) {
      zIndexMap[key].push(id);
    }

    const newIndex = zIndexMap[key].indexOf(id);

    return newIndex === -1 ? 0 : newIndex;
  }

  useUpdateEffect(() => {
    setZIndex(depChangeHandel());
  }, [dep]);


  function calc() {
    const index = zIndexMap[key].indexOf(id);
    return index === -1 ? 0 : index;
  }

  useEffect(() => {
    const index = calc();
    if (index !== zIndex) {
      setZIndex(index);
    }
    // eslint-disable-next-line
  }, [zIndexMap[key]?.length]);


  return [zIndex + initZIndex, zIndex];
}
