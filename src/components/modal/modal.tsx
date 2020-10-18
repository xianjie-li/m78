import React, { useRef, useState } from 'react';
import Portal from 'm78/portal';
import { Z_INDEX_MODAL } from 'm78/util';
import { useMeasure } from 'react-use';
import { config as spConfig, Transition, TransitionTypes } from '@lxjx/react-transition-spring';
import { useFormState, useSameState, useRefize, useSelf } from '@lxjx/hooks';
import { animated, to } from 'react-spring';

import cls from 'classnames';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import createRenderApi from '@lxjx/react-render-api';
import { useLifeCycle } from './lifeCycle';
import { useFromMouse } from './useFromMouse';
import { ModalBaseApi, ModalBaseProps, Share, TupleNumber } from './types';
import { useMethods } from './methods';
import { registerPositionSave } from './commons';

/** model的默认位置 */
const DEFAULT_ALIGN: TupleNumber = [0.5, 0.5];

/* NO-SSR */

registerPositionSave();

const _ModalBase: React.FC<ModalBaseProps> = props => {
  const {
    namespace = 'MODAL',
    alignment = DEFAULT_ALIGN,
    mask = true,
    maskClassName,
    maskTheme,
    animationType = 'fromMouse',
    mountOnEnter = true,
    unmountOnExit = false,
    clickAwayClosable = true,
    lockScroll = true,
    className,
    style,
    onClose,
    children,
    triggerNode,
    baseZIndex = Z_INDEX_MODAL,
    animationConfig = spConfig.stiff,
    alpha,
    innerRef,
  } = props;

  const _contRef = useRef<HTMLDivElement>(null!);

  /** 内容区域容器 */
  const contRef = innerRef || _contRef;

  /** 代理defaultShow/show/onChange, 实现对应接口 */
  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show',
  });

  /** 延迟设置为false的show，用于防止组件从实例列表中被生硬的移除(会打乱zIndex/动画状态等 ) */
  const delayShow = useDelayDerivedToggleStatus(show, 200, { trailing: true, leading: false });

  /** 管理所有show为true的Modal组件 */
  const [cIndex, instances] = useSameState('fr_modal_metas', {
    enable: delayShow,
    meta: {
      mask,
      clickAwayClosable,
      namespace,
    },
  });

  /** 当前组件应该显示的zIndex */
  const nowZIndex = cIndex === -1 ? baseZIndex : cIndex + baseZIndex;

  /** 监听容器大小变更 */
  const [bind, { width, height }] = useMeasure();

  /** 内容区域的xy坐标 */
  const [pos, setPos] = useState([0, 0]);

  const self = useSelf({
    /* ======== 用于fromMouse实现 ========= */
    /** 缓存的鼠标最后点击x、y轴位置 */
    x: 0,
    y: 0,
    /** 缓存的元素位置信息 */
    px: 0,
    py: 0,
    /** 缓存_FR_LAST_CLICK_POSITION_X, 用于无点时特殊设置入场离场动画  */
    pointX: 0,
    pointY: 0,
    /** 缓存动画起始位置，用于离场时作为目标位置 */
    startXPos: 0,
    startYPos: 0,
  });

  const share: Share = {
    cIndex,
    instances,
    namespace,
    mask,
    show,
    clickAwayClosable,
    contRef,
    alignment,
    setPos,
    refState: null as any,
    setShow,
    onClose,
    triggerNode,
    lockScroll,
    modalSize: [width, height],
    props,
    self,
    mountOnEnter,
    unmountOnExit,
    animationConfig,
  };

  const methods = useMethods(share);

  useLifeCycle(share, methods);

  /** ref化一些状态，方便读取 */
  share.refState = useRefize({
    show,
    maskShouldShow: methods.maskShouldShow(),
    shouldTriggerClose: methods.shouldTriggerClose(),
  });

  const isFromMouse = animationType === 'fromMouse';

  const [sp, mount] = useFromMouse(share, methods, isFromMouse);

  function renderCont() {
    if (isFromMouse) {
      return (
        mount && (
          <animated.div
            ref={contRef}
            className={cls('m78-modal', className)}
            style={{
              ...style,
              left: pos[0],
              top: pos[1],
              zIndex: nowZIndex,
              transform: to(
                [sp.x, sp.y, sp.scale],
                (x, y, scale) =>
                  `translate3d(${x}px,${y}px,0px) scale3d(${scale},${scale},${scale})`,
              ),
              opacity: sp.opacity,
            }}
          >
            <div className="m78-modal_calc-node" ref={bind} />
            {children}
          </animated.div>
        )
      );
    }

    return (
      <Transition
        toggle={show}
        type={animationType as TransitionTypes}
        config={animationConfig}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        innerRef={contRef}
        className={cls('m78-modal', className)}
        alpha={alpha}
        style={{
          ...style,
          left: pos[0],
          top: pos[1],
          zIndex: nowZIndex,
        }}
      >
        <div className="m78-modal_calc-node" ref={bind} />
        {children}
      </Transition>
    );
  }

  return (
    <>
      {triggerNode && React.cloneElement(triggerNode, { onClick: methods.onTriggerNodeClick })}
      <Portal namespace={namespace}>
        {share.refState.maskShouldShow && mask && (
          <Transition
            // 有遮罩时点击遮罩来关闭
            onClick={clickAwayClosable ? methods.close : undefined}
            toggle={show}
            type="fade"
            mountOnEnter
            unmountOnExit
            className={cls(maskTheme === 'dark' ? 'm78-mask-b' : 'm78-mask', maskClassName)}
            style={{ zIndex: nowZIndex }}
            reset
          />
        )}
        {renderCont()}
      </Portal>
    </>
  );
};

const api = createRenderApi<ModalBaseApi>(_ModalBase, {
  namespace: 'MODAL',
});

const baseApi: typeof api = ({ content, ...other }) => {
  return api({
    ...other,
    children: content,
    triggerNode: null,
  } as any);
};

type Modal = typeof _ModalBase;

interface ModalBaseWithApi extends Modal {
  api: typeof api;
}

const Modal: ModalBaseWithApi = Object.assign(_ModalBase, {
  api: baseApi,
});

export default Modal;
