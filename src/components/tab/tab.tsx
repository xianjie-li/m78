import React, { useRef } from 'react';
import cls from 'classnames';
import { useFormState, useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { animated, useSpring } from 'react-spring';
import { PositionEnum } from 'm78/types';
import Carousel, { CarouselRef } from 'm78/carousel';
import { CaretLeftOutlined, CaretRightOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { formatChild, getChildProps } from './common';
import { Share, TabProps } from './type';
import { useMethods } from './methods';
import { useLifeCycle } from './life-cycle';

const defaultProps = {
  loop: false,
};

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

  // 格式化TabItem列表
  const child = formatChild(children);

  // 所有item的prop配置
  const childProps = getChildProps(child);

  // 内部状态
  const [state, setState] = useSetState<Share['state']>({
    startFlag: false,
    endFlag: false,
    hasTouch: false,
  });

  // 是否纵向显示
  const isVertical = position === PositionEnum.left || position === PositionEnum.right;

  // 实例状态
  const self = useSelf<Share['self']>({
    itemSpringSetCount: 0,
    tabRefs: [],
  });

  const carouselRef = useRef<CarouselRef>(null!);

  // 线条动画
  const [spProps, set] = useSpring(() => ({ length: 0, offset: 0 }));

  // 控制tab显示
  const [val, setVal] = useFormState(props, 0, {
    valueKey: 'index',
    defaultValueKey: 'defaultIndex',
  });

  const share: Share = {
    isVertical,
    self,
    state,
    setState,
    val,
    setVal,
    set,
    carouselRef,
    disabled,
    scroller: null as any,
    child,
  };

  // 内部方法
  const methods = useMethods(share);

  const { onScroll, onTabClick } = methods;

  // 控制滚动
  share.scroller = useScroll<HTMLDivElement>({
    onScroll,
    throttleTime: 50,
    touchOffset: 6,
  });

  // 挂载各种生命周期
  useLifeCycle(share, methods, props);

  if (!childProps.length) {
    return null;
  }

  return (
    <div
      className={cls(
        'm78-tab',
        size && `__${size}`,
        position && `__${position}`,
        flexible && '__flexible',
        noSplitLine && '__noSplitLine',
        className,
        '__hasPage',
        'm78-scroll-bar',
      )}
      style={style}
    >
      <div className="m78-tab_tabs-wrap" style={{ height: isVertical ? height : undefined }}>
        <If when={!state.hasTouch && state.startFlag}>
          <CaretLeftOutlined
            className="m78-tab_start-ctrl"
            title="上翻"
            onClick={methods.scrollPrev}
          />
        </If>

        {state.startFlag && (
          <div className={cls('m78-tab_scroll-flag __start', isVertical && '__isVertical')} />
        )}

        {state.endFlag && (
          <div className={cls('m78-tab_scroll-flag', isVertical && '__isVertical')} />
        )}

        <If when={!state.hasTouch && state.endFlag}>
          <CaretRightOutlined
            className="m78-tab_end-ctrl"
            title="下翻"
            onClick={methods.scrollNext}
          />
        </If>

        <div className="m78-tab_tabs" ref={share.scroller.ref as any}>
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
                [isVertical ? 'height' : 'width']: spProps.length.to(w => `${w}px`),
                transform: spProps.offset.to(
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
