import { isNumber } from '@lxjx/utils';
import { useScroll } from '@lxjx/hooks';
import { Share, TabItemProps } from './type';

type ScrollMeta = ReturnType<ReturnType<typeof useScroll>['get']>;

export function useMethods(share: Share) {
  const { isVertical, self, set, val, setVal, carouselRef, disabled, state, setState } = share;

  /** 根据索引设置活动线的状态 */
  function refreshItemLine(index: number) {
    const itemEl = self.tabRefs[index];

    if (!itemEl) return;

    const length = isVertical ? itemEl.offsetHeight : itemEl.offsetWidth;
    const offset = isVertical ? itemEl.offsetTop : itemEl.offsetLeft;

    set({ length, offset, immediate: self.itemSpringSetCount === 0 });

    self.itemSpringSetCount++;
  }

  /** 根据当前滚动状态设置滚动内容指示器的状态 */
  function refreshScrollFlag(meta: ScrollMeta, tabsEl: NodeListOf<HTMLDivElement>, index: number) {
    if (!hasScroll(meta)) return;

    const currentEl = tabsEl[index];
    const nextEl = tabsEl[index + 1];
    const prevEl = tabsEl[index - 1];

    if (!currentEl) return;
    if (!nextEl && !prevEl) return;

    let offset: number;

    const scrollOffset = isVertical ? meta.y : meta.x;

    if (prevEl) {
      // 当前元素上一个元素不可见
      const prevOffset = isVertical ? prevEl.offsetTop : prevEl.offsetLeft;

      if (prevOffset < scrollOffset) {
        offset = prevOffset;
      }
    } else {
      // 处理第一个元素点击
      offset = 0;
    }

    if (nextEl) {
      // 当前元素下一个元素不可见
      const wrapSize = isVertical ? meta.height : meta.width;
      const nextOffset = isVertical ? nextEl.offsetTop : nextEl.offsetLeft;
      const nextSize = isVertical ? nextEl.offsetHeight : nextEl.offsetWidth;

      if (scrollOffset + wrapSize < nextOffset + nextSize) {
        offset = nextOffset + nextSize - wrapSize;
      }
    } else {
      // 处理最后一个元素点击
      offset = isVertical ? meta.yMax : meta.xMax;
    }

    if (!isNumber(offset!)) return;

    share.scroller.set({ [isVertical ? 'y' : 'x']: offset });
  }

  /** 检测是否可滚动，接收 UseScrollMeta */
  function hasScroll(meta: ScrollMeta) {
    const _maxSize = isVertical ? meta.yMax : meta.xMax;

    return !!_maxSize;
  }

  /** tab项点击 */
  function onTabClick(itemProps: TabItemProps, index: number) {
    if (val === index) return;
    if (itemProps.disabled || disabled) return;

    if (self.itemSpringSetCount !== 0) {
      carouselRef.current.goTo(index);
    }

    setVal(index);
  }

  // 向前或后滚动tab, flag为true时为前滚动
  function scrollPage(flag: boolean) {
    const { get, set: setScroll } = share.scroller;
    const { width, height } = get();

    const offset = isVertical ? height : width;

    setScroll({ [isVertical ? 'y' : 'x']: flag ? offset : -offset, raise: true });
  }

  function scrollPrev() {
    scrollPage(false);
  }

  function scrollNext() {
    scrollPage(true);
  }

  function onScroll(meta: ScrollMeta) {
    if (hasScroll(meta)) {
      const nextStart = isVertical ? !meta.touchTop : !meta.touchLeft;
      const nextEnd = isVertical ? !meta.touchBottom : !meta.touchRight;

      if (nextStart !== state.startFlag || nextEnd !== state.endFlag) {
        setState({
          endFlag: nextEnd,
          startFlag: nextStart,
        });
      }
    } else if (state.endFlag || state.startFlag) {
      setState({
        endFlag: false,
        startFlag: false,
      });
    }
  }

  return {
    refreshItemLine,
    refreshScrollFlag,
    hasScroll,
    onTabClick,
    onScroll,
    scrollNext,
    scrollPrev,
  };
}
