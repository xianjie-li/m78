import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Button } from 'm78/button';
import { CaretUpOutlined } from 'm78/icon';
import { getScrollParent } from '@lxjx/utils';
import { useFn, useScroll, getRefDomOrDom } from '@lxjx/hooks';
import _debounce from 'lodash/debounce';
import { Transition } from 'm78/transition';
import cls from 'clsx';
import { Portal } from 'm78/portal';
import { ComponentBaseProps } from 'm78/types';

interface BackTopProps extends ComponentBaseProps {
  /**
   * 目标滚动容器
   * - 如果未传入会查找第一个可滚动的父级，且挂载到body下
   * - 如果传入，挂载到组件所在位置并以传入节点作为滚动目标
   * */
  target?: HTMLElement | RefObject<HTMLElement>;
  /** 自定义内容 */
  children?: React.ReactNode;
  /** 500 | 滚动达到此高度时出现 */
  threshold?: number;
  /** 200 | 防抖时间(ms) */
  debounceTime?: number;
}

const BackTop = ({
  target,
  debounceTime = 200,
  threshold = 500,
  children,
  className,
  style,
}: BackTopProps) => {
  // 包裹元素
  const wrapRef = useRef<HTMLDivElement>(null!);

  // 显示隐藏
  const [show, setShow] = useState(false);

  // 滚动元素
  const [el, setEl] = useState<HTMLElement | null>();

  // 获取滚动元素
  useEffect(() => {
    const passEl = getRefDomOrDom(target);

    if (passEl) {
      setEl(passEl);
      return;
    }

    const sp = getScrollParent(wrapRef.current);

    setEl(sp);
  }, [target]);

  // 处理滚动
  const scrollHandler = useFn(
    ({ y }) => {
      if (y >= threshold) {
        !show && setShow(true);
      } else {
        show && setShow(false);
      }
    },
    fn => _debounce(fn, debounceTime),
  );

  const sh = useScroll({
    el: el!,
    onScroll: scrollHandler,
  });

  // 初始化处理
  useEffect(() => {
    if (el) {
      scrollHandler(sh.get());
    }
  }, []);

  function renderMain() {
    return (
      <Transition
        show={show}
        innerRef={wrapRef}
        className={cls('m78 m78-back-top', className)}
        title="返回顶部"
        type="slideRight"
        onClick={() => sh.set({ y: 0 })}
        style={style}
        mountOnEnter={false}
      >
        {children || (
          <Button>
            <CaretUpOutlined />
          </Button>
        )}
      </Transition>
    );
  }

  return target ? renderMain() : <Portal namespace="back-top">{renderMain()}</Portal>;
};

export default BackTop;
