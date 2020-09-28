import React, { ReactElement, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { useMeasure, useUpdate, useInterval } from 'react-use';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-use-gesture';
import _clamp from 'lodash/clamp';

import cls from 'classnames';

import { dumpFn } from '@lxjx/utils';
import { ComponentBaseProps } from '../types/types';

export interface CarouselProps extends ComponentBaseProps {
  /** 子元素，必须为多个直接子元素或子元素数组 */
  children: ReactElement[];
  /** false | 设置滚动方向为纵向, 当为纵向时，必须设置height，否则高度默认为0 */
  vertical?: boolean;
  /** vertical ? 0 : 'auto' | 当vertical为true时，必须设置高度 */
  height?: number | string;
  /** 'auto' | 宽度，与轮播项一致 */
  width?: number | string;
  /** true | 是否开启循环滚动 */
  loop?: boolean;
  /** 0 | 从0开始的默认页码 */
  initPage?: number;
  /** true | 是否开启分页控制和计数器，在横向滚动时，当滚动项总数大于7，计数器会自动更换为数字数据器，纵向模式下计数器永远为图形计数器 */
  control?: boolean;
  /** 强制使用number计数器 */
  forceNumberControl?: boolean;
  /** 自动轮播 */
  autoplay?: number;
  /** 是否开启鼠标滚轮监听 */
  wheel?: boolean;
  /** 是否开启drag */
  drag?: boolean;
  /** 页码改变时触发，在mounted时也会触发，并且会传入first=true */
  onChange?: (currentPage: number, first?: boolean) => void;
  /** 当发生任何可能切换页面的操作(drag、滚动)时触发 */
  onWillChange?: () => void;
  /** 禁用缩放动画 */
  noScale?: boolean;
  /** 将不可见内容卸载，只保留空容器(由于存在动画，当前项的前后容器总是会保持装载状态, 启用loop时会有额外规则，见注意事项) */
  invisibleUnmount?: boolean;
  /** 元素不可见时，将其display设置为node(需要保证每项只包含一个子元素且能够设置style，注意事项与invisibleUnmount一致) */
  invisibleHidden?: boolean;
}

export interface CarouselRef {
  /** 跳转到前一页 */
  prev(): void;
  /** 跳转到后一页 */
  next(): void;
  /**
   * 跳转到指定页
   * @param currentPage - 页码
   * @param immediate - 是否跳过动画
   * */
  goTo(currentPage: number, immediate?: boolean): void;
}

/** 当开启loop时，将children转换为指定的格式, 第一位和最后一位分别赋值到首尾 */
function loopChildrenHandle(children: ReactElement[], loop: boolean): [ReactElement[], boolean] {
  if (children.length < 2 || !loop) return [children, false];
  const _child = React.Children.toArray(children) as ReactElement[];
  _child.push(React.cloneElement(children[0]));
  _child.unshift(React.cloneElement(children[children.length - 1]));
  return [_child, true];
}

const Carousel = React.forwardRef<CarouselRef, CarouselProps>(
  (
    {
      children: _children,
      vertical = false,
      height: _height,
      width: _width,
      loop = true,
      control = true,
      forceNumberControl = false,
      initPage = 0,
      onChange,
      autoplay = 0,
      style,
      className,
      wheel = true,
      drag = true,
      onWillChange = dumpFn,
      noScale = false,
      invisibleUnmount = false,
      invisibleHidden = false,
    },
    ref,
  ) => {
    // 格式化children为适合loop的格式，后面一律以loopValid决定是否开启了loop
    const [children, loopValid] = loopChildrenHandle(_children, loop);

    // 获取包裹元素的尺寸等信息
    const [wrapRef, { width, height }] = useMeasure();

    // 用于阻止轮播组件内图片的drag操作
    const innerWrap = useRef<HTMLDivElement>(null!);

    // 决定每页的尺寸
    const size = vertical ? height : width;

    // 当前页码，当为loop时，所有页码的基准值要+1
    const page = useRef(loopValid ? initPage + 1 : initPage);

    // 切换动画相关
    const [spProp, set] = useSpring(() => ({
      offset: page.current * size,
      scale: 1,
      config: { clamp: true },
    }));

    const update = useUpdate();

    // 延迟时间，为0时停止
    const [delay, setDelay] = useState(autoplay);
    // 自动轮播计时器
    const autoPlayFlag = useRef<number>();

    _height = _height || 0;

    useEffect(
      function resize() {
        goTo(page.current, true);
      },
      [size],
    );

    useEffect(
      function childChange() {
        page.current = loopValid ? initPage + 1 : initPage;
        goTo(page.current, true);
        // /* 解决图片的拖动问题 */
        // Array.from(innerWrap.current.querySelectorAll('img')).forEach(item => {
        //   item.setAttribute('draggable', 'false');
        // });
      },
      [children.length],
    );

    useEffect(function mount() {
      pageChange(page.current, true);
      // eslint-disable-next-line
    }, []);

    useImperativeHandle(ref, () => ({
      prev,
      next,
      goTo,
    }));

    useInterval(
      function autoPlayHandle() {
        next();
      },
      delay > 0 ? delay : null,
    );

    const bind = useGesture(
      {
        onDragStart() {
          onWillChange();
        },
        onWheelStart() {
          onWillChange();
        },
        onDrag({
          event,
          down,
          movement: [xMove, yMove],
          direction: [xDirect, yDirect],
          cancel,
          first,
        }) {
          event?.stopPropagation();
          event?.preventDefault();

          const move = vertical ? yMove : xMove;
          const distance = Math.abs(move);
          const direct = vertical ? yDirect : xDirect;

          if (down && distance > size / 2) {
            cancel!();
            stopAutoPlay();
            direct < 0 ? next() : prev();
          }

          /* loop 处理 */
          if (loopValid && first && page.current === 0) {
            goTo(children.length - 2, true);
          }

          if (loopValid && first && page.current === children.length - 1) {
            goTo(1, true);
          }

          set({
            offset: -(page.current * size + (down ? -move : 0)),
            immediate: false,
            scale: down ? 1 - distance / size / 2 : 1, // 收缩比例为在元素上滚动距离相对于元素本身的比例
          });
        },
        // eslint-disable-next-line
        onWheel({ event, memo, direction: [, directY], time }) {
          event?.preventDefault();
          if (memo) return;
          directY < 0 ? prev() : next();
          stopAutoPlay();
          return time;
        },
        onHover({ hovering }) {
          hovering && stopAutoPlay();
        },
      },
      {
        domTarget: innerWrap,
        wheel,
        drag,
        event: { passive: false },
      },
    );

    useEffect(bind, [bind]);

    /** 跳转至上一页 */
    function prev() {
      if (loopValid && page.current === 0) {
        goTo(children.length - 2, true);
      }
      goTo(calcPage(page.current - 1));
    }

    /** 跳转至下一页 */
    function next() {
      if (loopValid && page.current === children.length - 1) {
        goTo(1, true);
      }
      goTo(calcPage(page.current + 1));
    }

    /**
     * @description - 跳转到指定页
     * @param currentPage - 待调跳转的页面
     * @param immediate - 跳过动画
     * */
    function goTo(currentPage: number, immediate = false) {
      currentPage = calcPage(currentPage);
      if (!immediate && currentPage !== page.current) {
        pageChange(currentPage);
      }
      page.current = currentPage;
      update();
      set({
        offset: -(currentPage * size),
        immediate,
        // onFrame(ds) {
        //   console.log(111, ds);
        // },
      });
    }

    /** 防止上下页超出页码区间 */
    function calcPage(nextPage: number) {
      return _clamp(nextPage, 0, children.length - 1);
    }

    /** 根据指定页码计算实际页码，用于处理开启loop后页面顺序错乱的问题 */
    function getPageNumber(currentPage: number) {
      if (!loopValid) {
        return currentPage;
      }
      if (currentPage === 0) return children.length - 3;
      if (currentPage === children.length - 1) return 0;
      return currentPage - 1;
    }

    function pageChange(currentPage: number, first?: boolean) {
      onChange && onChange(getPageNumber(currentPage), !!first);
    }

    /** 暂时关闭自动轮播 */
    function stopAutoPlay() {
      if (autoplay <= 0 || delay <= 0) return;
      if (autoPlayFlag.current) {
        return;
      }

      setDelay(0);

      autoPlayFlag.current = window.setTimeout(() => {
        setDelay(autoplay);
        autoPlayFlag.current = undefined;
        clearTimeout(autoPlayFlag.current);
      }, 4000);
    }

    function renderItem(item: ReactElement, i: number) {
      // 是否需要render，取决于invisibleUnmount和当前页面
      let needMount = true;

      let renderNode = item;

      if (invisibleUnmount || invisibleHidden) {
        const pInd = getPageNumber(page.current);
        // 启用了loop且为前两页和后两页
        const isLoopAndFirstOrLast = loopValid && (i <= 1 || i >= children.length - 2);
        // 不在前一页或后一页之间(根据loop状态调整)
        const notBeforeAfterBetween =
          i < pInd - (loopValid ? 0 : 1) || i > pInd + (loopValid ? 2 : 1);

        const pass = !notBeforeAfterBetween || isLoopAndFirstOrLast;

        if (invisibleUnmount) {
          needMount = pass;
        }

        if (invisibleHidden && !pass && React.isValidElement<{ style: any }>(item)) {
          renderNode = React.cloneElement(item, {
            style: { ...item.props.style, display: 'none' },
          });
        }
      }

      return (
        <animated.div
          key={i}
          className="m78-carousel_item"
          style={{
            zIndex: page.current === i ? 1 : 0,
            transform: noScale
              ? undefined
              : spProp.scale.interpolate(_scale => {
                  /* 指定当前不参与动画的页 */
                  const skip = i < page.current - 1 || i > page.current + 1;
                  return `scale(${skip ? 1 : _scale})`;
                }),
          }}
        >
          {needMount && renderNode}
        </animated.div>
      );
    }

    return (
      <div
        className={cls('m78-carousel', className, { __vertical: vertical })}
        ref={wrapRef}
        style={{ height: vertical ? _height : 'auto', width: _width || 'auto', ...style }}
      >
        <animated.div
          className="m78-carousel_wrap"
          ref={innerWrap}
          style={{
            transform: spProp.offset.interpolate(
              _offset => `translate3d(${vertical ? `0,${_offset}px` : `${_offset}px,0`},0)`,
            ),
          }}
        >
          {children.map(renderItem)}
        </animated.div>
        {control && (
          <div className="m78-carousel_ctrl m78-stress">
            {(_children.length < 7 || vertical) && !forceNumberControl ? (
              children.map((v, i) => {
                const show = loopValid ? i < children.length - 2 : true;
                return (
                  show && (
                    <div
                      key={i}
                      onClick={() => {
                        goTo(loopValid ? i + 1 : i);
                        stopAutoPlay();
                      }}
                      className={cls('m78-carousel_ctrl-item', {
                        __active: i === getPageNumber(page.current),
                      })}
                    />
                  )
                );
              })
            ) : (
              <span className="m78-carousel_ctrl-text">
                {getPageNumber(page.current) + 1} /{' '}
                {loopValid ? children.length - 2 : children.length}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

export default Carousel;
