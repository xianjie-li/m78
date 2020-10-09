import React, { useEffect, useRef } from 'react';
import cls from 'classnames';
import { useFormState, useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { animated, useSpring } from 'react-spring';
import { Position } from 'm78/util';
import Carousel, { CarouselRef } from 'm78/carousel';
import { DoubleLeftOutlined, DoubleRightOutlined } from 'm78/icon';
import { useScrollbarWidth } from 'react-use';
import { isNumber } from '@lxjx/utils';
import { formatChild, getChildProps } from './common';
import { TabItemProps, TabProps } from './type';

const defaultProps = {
  loop: false,
};

/* 直接出现阴影，不使用点击控制，滚动条大于 6 ? 使用滚轮代理模式， 否则使用滚动条自由拖动 */

const Tab: React.FC<TabProps> = props => {
  const {
    size,
    position,
    flexible,
    children,
    height,
    invisibleHidden,
    invisibleUnmount,
    disabled,
    loop,
    noActiveLine,
    noSplitLine,
    className,
    style,
  } = props as TabProps & typeof defaultProps;

  // TabItem列表
  const child = formatChild(children);

  // 所有item的prop配置
  const childProps = getChildProps(child);

  const scrollBarW = useScrollbarWidth();

  const [state, setState] = useSetState({
    startFlag: false,
    endFlag: false,
  });

  // 纵向显示
  const isVertical = position === Position.left || position === Position.right;

  const self = useSelf({
    itemSpringSetCount: 0,
    tabRefs: [] as HTMLDivElement[],
  });

  const carouselRef = useRef<CarouselRef>(null!);

  const [spProps, set] = useSpring(() => ({ length: 0, offset: 0 }));

  const { ref: tabWrapRef, get: getScrollMeta, set: setScroll } = useScroll<HTMLDivElement>({
    onScroll(meta) {
      if (hasScroll(meta)) {
        const nextStart = isVertical ? !meta.touchTop : !meta.touchLeft;
        const nextEnd = isVertical ? !meta.touchBottom : !meta.touchRight;

        if (nextStart !== state.startFlag || nextEnd !== state.endFlag) {
          console.log('refresh');

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
    },
  });

  // 控制tab显示
  const [val, setVal] = useFormState(props, 0, {
    valueKey: 'index',
    defaultValueKey: 'defaultIndex',
  });

  // 更新活动线
  useEffect(() => {
    !noActiveLine && refreshItemLine(val);
  }, [val, size, position, child.length, flexible]);

  // 修正滚动位置
  useEffect(() => {
    const sm = getScrollMeta();

    if (!tabWrapRef.current) return;

    const tabs = tabWrapRef.current.querySelectorAll<HTMLDivElement>('.m78-tab_tabs-item');

    refreshScrollFlag(sm, tabs, val);
  }, [val]);

  if (!childProps.length) {
    return null;
  }

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
  function refreshScrollFlag(
    meta: ReturnType<typeof getScrollMeta>,
    tabsEl: NodeListOf<HTMLDivElement>,
    index: number,
  ) {
    console.log(hasScroll(meta));

    if (!hasScroll(meta)) return;

    const currentEl = tabsEl[index];
    const nextEl = tabsEl[index + 1];
    const prevEl = tabsEl[index - 1];

    console.log(nextEl, prevEl);

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

    setScroll({ [isVertical ? 'y' : 'x']: offset });
  }

  /** 检测是否可滚动，接收 UseScrollMeta */
  function hasScroll(meta: ReturnType<typeof getScrollMeta>) {
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

  return (
    <div
      className={cls(
        'm78-tab',
        {},
        size && `__${size}`,
        position && `__${position}`,
        flexible && '__flexible',
        noSplitLine && '__noSplitLine',
        className,
        '__hasPage',
      )}
      style={style}
    >
      <div className="m78-tab_tabs-wrap" style={{ height: isVertical ? height : undefined }}>
        {state.endFlag && (
          <div className={cls('m78-tab_scroll-flag', isVertical && '__isVertical')} />
        )}
        {state.startFlag && (
          <div className={cls('m78-tab_scroll-flag __start', isVertical && '__isVertical')} />
        )}

        <div className="m78-tab_tabs" ref={tabWrapRef}>
          {childProps.map((item, index) => (
            <div
              key={item.value}
              className={cls('m78-tab_tabs-item m78-effect __md', {
                __active: val === index,
                __disabled: item.disabled,
              })}
              onClick={() => onTabClick(item, index)}
              ref={node => (self.tabRefs[index] = node!)}
            >
              <div>{item.label}</div>
            </div>
          ))}

          {!noActiveLine && (
            <animated.div
              className="m78-tab_line"
              style={{
                [isVertical ? 'height' : 'width']: spProps.length.interpolate(w => `${w}px`),
                transform: spProps.offset.interpolate(
                  ofs => `translate3d(${isVertical ? 0 : ofs}px, ${isVertical ? ofs : 0}px, 0px)`,
                ),
              }}
            />
          )}
        </div>
      </div>

      <Carousel
        className="m78-tab_cont"
        ref={carouselRef}
        initPage={val}
        noShadow
        noScale
        loop={loop}
        control={false}
        invisibleHidden={invisibleHidden}
        invisibleUnmount={invisibleUnmount}
        height={height}
        vertical={isVertical}
        onChange={(index, first) => {
          !first && setVal(index);
        }}
      >
        {child}
      </Carousel>
    </div>
  );
};

Tab.defaultProps = defaultProps;

export default Tab;
