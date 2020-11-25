import React, { useEffect, useMemo, useRef } from 'react';
import { useDrag } from 'react-use-gesture';
import { useUpdate } from 'react-use';
import { createRandString } from '@lxjx/utils';
import { useFn, useSetState } from '@lxjx/hooks';

const listener: any = {};

const someRatio = 0.2;

const DND = ({ children }) => {
  const id = useMemo(() => createRandString(2), []);

  const [status, setStatus] = useSetState({
    dragOver: false,
    dragLeft: false,
    dragRight: false,
    dragBottom: false,
    dragTop: false,
    dragCenter: false,
    dragging: false,
  });

  const elRef = useRef<HTMLElement>(null!);
  const handleRef = useRef<HTMLElement>(null!);

  const cloneNode = useRef<HTMLElement>(null!);

  const change = useFn((x1, y1) => {
    const { left, top, right, bottom } = elRef.current.getBoundingClientRect();

    const width = right - left;
    const height = bottom - top;

    const triggerXOffset = width * someRatio;
    const triggerYOffset = height * someRatio;

    const dragOver = x1 > left && x1 < right && y1 > top && y1 < bottom;
    const dragTop = dragOver && y1 < top + triggerYOffset;
    const dragBottom = dragOver && !dragTop && y1 > bottom - triggerYOffset;
    const dragLeft = dragOver && !dragBottom && x1 < left + triggerXOffset;
    const dragRight = dragOver && !dragLeft && x1 > right - triggerXOffset;
    const dragCenter = dragOver && !dragTop && !dragBottom && !dragRight && !dragLeft;

    if (
      status.dragOver === dragOver &&
      status.dragTop === dragTop &&
      status.dragBottom === dragBottom &&
      status.dragLeft === dragLeft &&
      status.dragRight === dragRight &&
      status.dragCenter === dragCenter
    ) {
      return;
    }

    setStatus({
      dragOver,
      dragTop,
      dragBottom,
      dragLeft,
      dragRight,
      dragCenter,
    });
  });

  console.log(status);

  useEffect(() => {
    listener[id] = change;
  }, [change]);

  useDrag(
    ({ movement: [moveX, moveY], xy: [x, y], down, first, tap, event }) => {
      if (tap) return;

      event?.preventDefault();

      if (first) {
        startHandle();
      }

      if (!down) {
        endHandle();
        return;
      }

      Object.entries(listener).forEach(([key, fnc]) => {
        if (key !== id) fnc(x, y);
      });

      cloneNode.current.style.transform = `translate(${moveX}px, ${moveY}px)`;

      // console.log(cloneNode.current.getBoundingClientRect());
    },
    {
      domTarget: elRef,
      filterTaps: true,
      eventOptions: {
        passive: false,
      },
    },
  );

  function startHandle() {
    setStatus({
      dragging: true,
    });

    cloneNode.current = elRef.current.cloneNode(true) as HTMLElement;

    const { x, y } = elRef.current.getBoundingClientRect();

    cloneNode.current.style.position = 'fixed';
    cloneNode.current.style.left = `${x}px`;
    cloneNode.current.style.top = `${y}px`;
    cloneNode.current.style.opacity = '0.7';

    document.body.appendChild(cloneNode.current);
  }

  function endHandle() {
    setStatus({
      dragging: false,
    });

    cloneNode.current.style.transition = `0.3s`;
    cloneNode.current.style.transform = `translate(0, 0)`;

    setTimeout(() => {
      cloneNode.current.parentNode.removeChild(cloneNode.current);
    }, 400);
  }

  return children({
    innerRef: elRef,
  });
};

export default DND;
