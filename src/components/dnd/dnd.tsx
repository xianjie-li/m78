import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import { createRandString } from '@lxjx/utils';
import { useFn, useSelf, useSetState } from '@lxjx/hooks';
import { initStatus } from 'm78/dnd/consts';
import DNDCtx from './context';
import { DNDProps, Share } from './types';
import { useMethods } from './useMethods';

/**
 * 网格拖动动画demo
 * 同时指出移动、pc
 * 启发式的拖动组件
 * */

const DND = (props: DNDProps) => {
  const { children } = props;

  const id = useMemo(() => createRandString(2), []);

  const ctx = useContext(DNDCtx);

  const elRef = useRef<HTMLElement>(null!);

  const handleRef = useRef<HTMLElement>(null!);

  const self = useSelf({
    cloneNode: null,
    clearCloneTimer: null,
    lastOverStatus: false,
  });

  const [status, setStatus] = useSetState(() => ({ ...initStatus }));

  const share: Share = {
    elRef,
    status,
    setStatus,
    props,
    self,
    id,
    ctx,
    currentNode: {
      id,
      data: props.data,
    },
  };

  const methods = useMethods(share);

  const bind = useDrag(methods.dragHandle, {
    domTarget: elRef,
    filterTaps: true,
    eventOptions: {
      passive: false,
    },
  });

  useEffect(bind, [bind]);

  return children({
    innerRef: elRef,
    status,
  });
};

export default DND;
