import _throttle from "lodash/throttle";

export interface DomAdaptionConfig {
  /** 需要自适应的dom元素 */
  el: HTMLElement;
  /** 1920 | 设计图宽度 */
  designWidth?: number;
  /** 1080 | 设计图高度 */
  designHeight?: number;
  /** 是否保证宽高比例（为false时在设计图宽高比与屏幕不同的情况下会出现变形） */
  keepRatio?: boolean;
}

const defaultConfig = {
  designWidth: 1920,
  designHeight: 1080,
  keepRatio: true,
};

/**
 *  缩放指定dom以兼容屏幕尺寸
 *  缩放比换算公式: 页面实际尺寸 / 设计图尺寸
 *  */
export function domAdaption(config: DomAdaptionConfig) {
  const _config = { ...defaultConfig, ...config };

  fixSize(_config);

  const set = _throttle(
    () => {
      fixSize(_config);
    },
    1000,
    { leading: false, trailing: true }
  );

  window.addEventListener("resize", set);

  return () => {
    window.removeEventListener("resize", set);
  };
}

function fixSize({
  designWidth,
  designHeight,
  keepRatio,
  el,
}: Required<DomAdaptionConfig>) {
  const sSize = getScreenSize();
  const xScale = sSize.w / designWidth;
  const yScale = sSize.h / designHeight;

  const base = Math.min(xScale, yScale); //  永远悲观的选择最小缩放值
  const xS = keepRatio ? base : xScale;
  const yS = keepRatio ? base : yScale;

  el.style.position = "fixed";
  el.style.top = "50%";
  el.style.left = "50%";
  el.style.transform = `scale3d(${xS}, ${yS}, 1) translate3d(-50%, -50%, 0)`;
  el.style.width = `${designWidth}px`;
  el.style.height = `${designHeight}px`;
  el.style.transformOrigin = "left top";
}

function getScreenSize() {
  return {
    w: window.innerWidth,
    h: window.innerHeight,
  };
}
