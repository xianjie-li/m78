import { isNumber } from "@m78/utils";

/** 实现下拉刷新时, 在某些设备上禁用滚动位置为0时的下拉(如微信/ios) */
export function preventTopPull(el: HTMLElement) {
  // 记录起始offset
  let offset: number | null = null;
  // 记录起始scrollTop
  let scrollTop: number | null = null;

  const start = (e: TouchEvent) => {
    offset = e.targetTouches[0].screenY;
    scrollTop = el.scrollTop;
  };

  const move = (e: TouchEvent) => {
    if (!isNumber(offset) || !isNumber(scrollTop)) return;

    const nowOffset = e.targetTouches[0].screenY;

    const isPullDown = nowOffset - offset > 0;

    if (scrollTop === 0 && isPullDown) {
      e.preventDefault();
    }
  };

  const end = () => {
    offset = null;
    scrollTop = null;
  };

  el.addEventListener("touchstart", start);
  el.addEventListener("touchmove", move);
  el.addEventListener("touchend", end);

  return () => {
    el.removeEventListener("touchstart", start);
    el.removeEventListener("touchmove", move);
    el.removeEventListener("touchend", end);
  };
}
