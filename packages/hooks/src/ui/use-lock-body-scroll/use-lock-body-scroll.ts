import { useEffect, useMemo, useRef } from "react";
import { createRandString, hasScroll } from "@m78/utils";

let scrollPosition = 0; // 保存锁定时的滚动位置

const list: any = [];

/**
 * 锁定滚动条并对滚动条宽度进行修正
 * @param locked - 根据传入值对滚动条进行锁定/解锁
 * */
export const useLockBodyScroll = (locked: boolean) => {
  const id = useMemo(() => createRandString(), []);

  const instance = useRef({
    bodyEl: null! as HTMLElement,
  });

  useEffect(() => {
    instance.current.bodyEl = document.body;
  }, []);

  // 存取list
  useEffect(() => {
    if (locked) {
      list.push(id);
      if (list.length === 1) lock();
    }
    return () => {
      if (!locked) return;
      const ind = list.indexOf(id);
      if (ind !== -1) list.splice(ind, 1);
      if (!list.length) unlock();
    };
  }, [locked]);

  function lock() {
    const bodyEl = instance.current.bodyEl;

    // 不同浏览器会使用不同的根滚动，这里需要进行一下兼容
    const bodyScrollInfo = hasScroll(bodyEl);
    const docScrollInfo = hasScroll(document.documentElement);

    const hasX = bodyScrollInfo.x || docScrollInfo.x;
    const hasY = bodyScrollInfo.y || docScrollInfo.y;

    bodyEl.setAttribute("data-locked", "1");
    scrollPosition = window.pageYOffset;
    bodyEl.style.width = "100%";
    bodyEl.style.overflowY = hasY ? "scroll" : "hidden";
    bodyEl.style.overflowX = hasX ? "scroll" : "hidden";
    bodyEl.style.position = "fixed";
    bodyEl.style.top = `-${scrollPosition}px`;
  }

  function unlock() {
    const bodyEl = instance.current.bodyEl;

    bodyEl.setAttribute("data-locked", "0");
    bodyEl.style.width = "";
    bodyEl.style.overflowY = "";
    bodyEl.style.overflowX = "";
    bodyEl.style.position = "";
    bodyEl.style.top = "";
    window.scrollTo(0, scrollPosition);
  }
};
