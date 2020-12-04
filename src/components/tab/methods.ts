import { defer, isNumber } from '@lxjx/utils';
import { UseScrollMeta } from '@lxjx/hooks';
import { Share, TabItemProps } from './type';

export function useMethods(share: Share) {
  const {
    isVertical,
    self,
    set,
    val,
    setVal,
    carouselRef,
    disabled,
    state,
    setState,
    index,
    values,
  } = share;

  /** 根据索引设置活动线的状态 */
  function refreshItemLine(_index: number) {
    const itemEl = self.tabRefs[_index];

    if (!itemEl) return;

    const length = isVertical ? itemEl.offsetHeight : itemEl.offsetWidth;
    const offset = isVertical ? itemEl.offsetTop : itemEl.offsetLeft;

    // TODO: 在移动端immediate不生效, 需要延迟执行, 原因不明
    defer(() => {
      set({ length, offset, immediate: self.itemSpringSetCount === 0 });

      self.itemSpringSetCount++;
    });
  }

  /** 根据当前滚动状态设置滚动内容指示器的状态 */
  function refreshScrollFlag(
    meta: UseScrollMeta,
    tabsEl: NodeListOf<HTMLDivElement>,
    _index: number,
  ) {
    if (!hasScroll(meta)) return;

    const currentEl = tabsEl[_index];
    const nextEl = tabsEl[_index + 1];
    const prevEl = tabsEl[_index - 1];

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
  function hasScroll(meta: UseScrollMeta) {
    const _maxSize = isVertical ? meta.yMax : meta.xMax;

    return !!_maxSize;
  }

  /** tab项点击 */
  function onTabClick(itemProps: TabItemProps, _index: number) {
    if (index === _index) return;
    if (itemProps.disabled || disabled) return;

    if (share.hasContent && self.itemSpringSetCount !== 0) {
      carouselRef.current.goTo(_index);
    }

    setVal(values[_index]);
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

  function onScroll(meta: UseScrollMeta) {
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
