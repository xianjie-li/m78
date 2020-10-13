import React, { useEffect, useRef } from 'react';
import { useLockBodyScroll, useSelf } from '@lxjx/hooks';
import { useDrag } from 'react-use-gesture';
import { useSetState, useToggle, useUpdateEffect } from 'react-use';
import _clamp from 'lodash/clamp';
import cls from 'classnames';

import Carousel, { CarouselRef } from 'm78/carousel';
import Viewer, { ViewerRef } from 'm78/viewer';
import Picture from 'm78/picture';
import {
  CloseCircleOutlined,
  RightOutlined,
  SyncOutlined,
  ZoomOutOutlined,
  ZoomInOutlined,
  RedoOutlined,
  UndoOutlined,
  LeftOutlined,
} from 'm78/icon';
import { If } from 'm78/fork';
import Portal from 'm78/portal';
import { stopPropagation } from 'm78/util';

import createRenderApi, { ReactRenderApiProps } from '@lxjx/react-render-api';
import { Transition } from '@lxjx/react-transition-spring';

export interface ImagePreviewProps extends ReactRenderApiProps {
  /** 图片数据 */
  images?: { img: string; desc?: string }[];
  /** 初始页码，组件创建后页码会由组件内部管理，当page值改变时会同步到组件内部 */
  page?: number;
}

/* 禁用内部图片的拖动 */
const disabledDrag = (event: React.DragEvent) => event.preventDefault();

/* TODO: 添加键盘操作 */

const _ImagePreview: React.FC<ImagePreviewProps> = ({
  page = 0,
  images = [],
  show,
  onClose,
  onRemove,
  namespace,
}) => {
  const carousel = useRef<CarouselRef>(null!);

  const wrapEl = useRef<HTMLDivElement>(null!);

  /* 锁定滚动条 + 防止页面抖动 */
  const [lock, toggleLock] = useToggle(!!show);
  useLockBodyScroll(lock);
  useUpdateEffect(() => {
    if (show) toggleLock(true);
    if (!show) {
      setTimeout(() => {
        toggleLock(false);
      }, 300);
    }
    // eslint-disable-next-line
  }, [show]);

  const self = useSelf<{
    viewers: {
      [key: string]: ViewerRef;
    };
    currentPage: number;
  }>({
    /** 存每一个Viewer的实例 */
    viewers: {},
    currentPage: calcPage(page),
  });

  const [state, setState] = useSetState({
    disabledPrev: false,
    disabledNext: false,
    zoomIn: false,
    zoomOut: false,
  });

  useEffect(
    function removeInstance() {
      if (!show) {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        setTimeout(onRemove!, 800);
      }
      // eslint-disable-next-line
    },
    [show],
  );

  useEffect(
    function initPageChange() {
      carousel.current && carousel.current.goTo(calcPage(page), true);
      // eslint-disable-next-line
    },
    [page],
  );

  const bindDrag = useDrag(
    ({ timeStamp, first, last, memo, movement: [x], direction: [direct, directY] }) => {
      if (direct + directY === 0 && last) {
        close();
      }

      if (last && memo) {
        const isPrev = direct > 0;
        const distanceOver = Math.abs(x) > window.innerWidth / 2; // 滑动距离超过半屏
        const timeOver = timeStamp! - memo < 220; // 220ms内

        if (timeOver && distanceOver) {
          isPrev ? prev() : next();
        }

        return undefined;
      }

      if (first) {
        return timeStamp;
      }
    },
  );

  function prev() {
    carousel.current.prev();
    calcDisabled();
  }

  function next() {
    carousel.current.next();
    calcDisabled();
  }

  /** 设置旋转 type: 为true时加 否则减 */
  function rotate(type: boolean) {
    const { setRotate } = getCurrentViewer();
    // console.log(instance);
    setRotate(type ? 45 : -45);
  }

  /** 设置缩放 type: 为true时加 否则减 */
  function scale(type: boolean) {
    const { instance, setScale } = getCurrentViewer();
    const diff = type ? 0.5 : -0.5;
    setScale(instance.scale + diff);
    calcDisabled();
  }

  function resetViewer() {
    const { reset } = getCurrentViewer();
    reset();
  }

  function close() {
    onClose && onClose();
  }

  function onChange(currentPage: number, first?: boolean) {
    const cViewer = getCurrentViewer();
    if (!cViewer || first) return;
    cViewer.reset();
    self.currentPage = calcPage(currentPage);
  }

  function calcPage(cPage: number) {
    return _clamp(cPage, 0, images.length - 1);
  }

  function getCurrentViewer() {
    return self.viewers[self.currentPage];
  }

  /** 根据当前值设置按钮的禁用状态 */
  function calcDisabled() {
    const { instance } = getCurrentViewer();
    setState({
      disabledPrev: self.currentPage === 0,
      disabledNext: self.currentPage === images.length - 1,
      zoomIn: instance.scale >= 3,
      zoomOut: instance.scale <= 0.5,
    });
  }

  return (
    <Portal namespace={namespace}>
      <Transition
        type="fade"
        toggle={show && images.length > 0}
        mountOnEnter
        className="m78-image-preview"
        innerRef={wrapEl}
      >
        <div {...bindDrag()}>
          <Carousel
            ref={carousel}
            initPage={page}
            wheel={false}
            drag={false}
            loop={false}
            forceNumberControl
            onChange={onChange}
          >
            {images.map((item, key) => (
              <div key={key} className="m78-image-preview_img-wrap">
                <Viewer ref={viewer => (self.viewers[key] = viewer!)} bound={wrapEl}>
                  <span>
                    <If when={self.currentPage >= key - 1 && self.currentPage <= key + 1}>
                      <Picture
                        {...stopPropagation}
                        src={item.img}
                        alt="图片加载失败"
                        className="m78-image-preview_img"
                        imgProps={{ onDragStart: disabledDrag }}
                      />
                    </If>
                  </span>
                </Viewer>
              </div>
            ))}
          </Carousel>
        </div>
        <div
          className="m78-image-preview_ctrl-bar"
          onClick={stopPropagation.onClick}
          onDragStart={e => e.stopPropagation()}
        >
          <If when={images.length > 1}>
            <span
              className={cls({ __disabled: state.disabledPrev })}
              title="上一张"
              onClick={() => prev()}
            >
              <LeftOutlined />
            </span>
          </If>
          <span title="左旋转" onClick={() => rotate(false)}>
            <UndoOutlined />
          </span>
          <span title="右旋转" onClick={() => rotate(true)}>
            <RedoOutlined />
          </span>
          <span
            className={cls({ __disabled: state.zoomIn })}
            title="放大"
            onClick={() => scale(true)}
          >
            <ZoomInOutlined />
          </span>
          <span
            className={cls({ __disabled: state.zoomOut })}
            title="缩小"
            onClick={() => scale(false)}
          >
            <ZoomOutOutlined />
          </span>
          <span title="重置" onClick={() => resetViewer()}>
            <SyncOutlined style={{ fontSize: 21 }} />{' '}
            {/* Sync图标基础大小比其他图标稍大，优化视觉效果 */}
          </span>
          <If when={images.length > 1}>
            <span
              className={cls({ __disabled: state.disabledNext })}
              title="下一张"
              onClick={() => next()}
            >
              <RightOutlined />
            </span>
          </If>
          <span title="关闭" onClick={close}>
            <CloseCircleOutlined />
          </span>
        </div>
      </Transition>
    </Portal>
  );
};

const api = createRenderApi<ImagePreviewProps>(_ImagePreview, {
  namespace: 'IMAGE_PREVIEW',
});

type ImagePreview = typeof _ImagePreview;

interface ImagePreviewWithApi extends ImagePreview {
  api: typeof api;
}

const ImagePreview: ImagePreviewWithApi = Object.assign(_ImagePreview, {
  api,
});

export default ImagePreview;
