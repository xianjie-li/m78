import React, { useEffect, useRef } from 'react';
import cls from 'classnames';
import { useFormState, useSelf } from '@lxjx/hooks';
import { animated, useSpring } from 'react-spring';
import { Position } from 'm78/util';
import Carousel, { CarouselRef } from 'm78/carousel';
import { formatChild, getChildProps } from './common';
import { TabItemProps, TabProps } from './type';

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
  } = props as TabProps & typeof defaultProps;

  // TabItem列表
  const child = formatChild(children);

  // 所有item的prop配置
  const childProps = getChildProps(child);

  // 纵向显示
  const isVertical = position === Position.left || position === Position.right;

  const self = useSelf({
    itemSpringSetCount: 0,
    tabRefs: [] as HTMLDivElement[],
  });

  const carouselRef = useRef<CarouselRef>(null!);

  const [spProps, set] = useSpring(() => ({ length: 0, offset: 0 }));

  // 控制tab显示
  const [val, setVal] = useFormState(props, 0, {
    valueKey: 'index',
    defaultValueKey: 'defaultIndex',
  });

  useEffect(() => {
    setItemStyle(val);
  }, [val]);

  if (!childProps.length) {
    return null;
  }

  /** 根据索引设置活动线的样式 */
  function setItemStyle(index: number) {
    const itemEl = self.tabRefs[index];

    if (!itemEl) return;

    const length = isVertical ? itemEl.offsetHeight : itemEl.offsetWidth;
    const offset = isVertical ? itemEl.offsetTop : itemEl.offsetLeft;

    set({ length, offset, immediate: self.itemSpringSetCount === 0 });

    self.itemSpringSetCount++;
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
        flexible && `__flexible`,
      )}
    >
      <div className="m78-tab_tabs">
        {/* <div className="m78-tab_page-ctrl __left"> */}
        {/*  <DoubleLeftOutlined /> */}
        {/* </div> */}
        {/* <div className="m78-tab_page-ctrl __right"> */}
        {/*  <DoubleRightOutlined /> */}
        {/* </div> */}

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

        <animated.div
          className="m78-tab_line"
          style={{
            [isVertical ? 'height' : 'width']: spProps.length.interpolate(w => `${w}px`),
            transform: spProps.offset.interpolate(
              ofs => `translate3d(${isVertical ? 0 : ofs}px, ${isVertical ? ofs : 0}px, 0px)`,
            ),
          }}
        />
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
          // console.log(index);
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
