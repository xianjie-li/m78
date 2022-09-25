import { isArray, isDom } from "@m78/utils";
import { RefObject } from "react";

/** 用于获取dom的target */
export type DomTarget = HTMLElement | RefObject<HTMLElement>;

/**
 * 依次从target、target.current、ref.current取值，只要有任意一个为dom元素则返回
 * 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined
 * */
export function getRefDomOrDom<H = HTMLElement>(
  target?: any,
  ref?: RefObject<any>
): H | undefined {
  if (isDom(target)) return target as unknown as H;
  if (target && isDom(target.current)) return target.current as H;
  if (ref && isDom(ref.current)) return ref.current as unknown as H;
  return undefined;
}

/** 增强的getRefDomOrDom, 可以从一组target或单个target中获取dom */
export function getTargetDomList<H = HTMLElement>(
  target?: DomTarget | DomTarget[],
  ref?: RefObject<any>
): H[] | undefined {
  if (target) {
    const targetList: DomTarget[] = isArray(target) ? target : [target];

    const ls = targetList
      .map((item) => getRefDomOrDom<H>(item))
      .filter((item) => !!item) as H[];

    if (ls.length) return ls;
  }

  const dom = getRefDomOrDom<H>(ref);

  if (dom) return [dom];
}
