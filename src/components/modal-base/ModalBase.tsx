import React, { useEffect, useRef, useState } from 'react';
import { ModalBaseProps, TupleNumber } from 'm78/modal-base/types';
import Portal from 'm78/portal';
import { calcAlignment } from 'm78/modal-base/commons';
import { useClickAway, useMeasure, useUpdateEffect } from 'react-use';
import { config, Transition } from '@lxjx/react-transition-spring';
import { useFormState, useLockBodyScroll, useSameState } from '@lxjx/hooks';

import cls from 'classnames';
import { useDelayDerivedToggleStatus } from 'm78/hooks';

// @lxjx\sass-base\var.scss line 128>
const MODAL_Z_INDEX = 1800;

const DEFAULT_ALIGN: TupleNumber = [0.5, 0.5];

const ModalBase: React.FC<ModalBaseProps> = props => {
  const {
    namespace = 'MODAL',
    alignment = DEFAULT_ALIGN,
    mask = true,
    maskClassName,
    maskTheme,
    animationType = 'fade',
    mountOnEnter = true,
    unmountOnExit = false,
    clickAwayClosable = true,
    lockScroll = true,
    className,
    style,
    onRemoveDelay = 800,
    onRemove,
    onClose,
  } = props;

  /** 内容区域容器 */
  const contRef = useRef<HTMLDivElement>(null!);

  /** 代理defaultShow/show/onClose, 实现对应接口 */
  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show',
  });

  /** 延迟设置为false的show，用于防止组件从实例列表中被生硬的移除(会打乱zIndex状态等 ) */
  const delayShow = useDelayDerivedToggleStatus(show, 300, { trailing: true, leading: false });

  const [cIndex, instances] = useSameState('fr_modal_metas', delayShow, {
    mask,
    clickAwayClosable,
  });

  const nowZIndex = cIndex === -1 ? MODAL_Z_INDEX : cIndex + MODAL_Z_INDEX;

  /** 监听大小 */
  const [bind, { width, height }] = useMeasure();

  /** 内容区域的xy坐标 */
  const [pos, setPos] = useState([0, 0]);

  const mss = maskShouldShow();

  const stc = shouldTriggerClose();

  // 滚动锁定
  useLockBodyScroll(lockScroll && show);

  // 无遮罩时，通过ClickAway来触发关闭，需要延迟一定的时间，因为用户设置的Modal开关可能会与ClickAway区域重叠
  useClickAway(contRef, () => {
    if ((clickAwayClosable && !mask && show) || (stc && !mss)) {
      setTimeout(close, 150);
    }
  });

  useUpdateEffect(() => {
    if (!show && onRemove) {
      setTimeout(onRemove, onRemoveDelay);
    }
  }, [show]);

  useEffect(() => {
    calcPos();
  }, [width, height]);

  /** 屏幕尺寸改变/容器尺寸改变时调用 */
  function calcPos() {
    const screenMeta: TupleNumber = [window.innerWidth - width, window.innerHeight - height];

    setPos(calcAlignment(alignment, screenMeta));
  }

  function close() {
    if (stc) {
      setShow(false);
      onClose?.();
    }
  }

  /** 根据该组件所有已渲染实例判断是否应开启mask */
  function maskShouldShow() {
    if (!mask) return false;

    // 当前实例之前所有实例组成的数组
    const beforeInstance = instances.slice(0, cIndex);

    // 在该实例之前是否有任意一个实例包含mask
    const beforeHasMask = beforeInstance.some(item => item.meta.mask);

    return !beforeHasMask;
  }

  /** 根据前后实例判断是否需要触发Away点击关闭 */
  function shouldTriggerClose() {
    if (!clickAwayClosable) return true;

    // 当前实例之前所有实例组成的数组
    const afterInstance = instances.slice(cIndex + 1);

    // 在该实例之前是否有任意一个实例包含mask
    const afterHasAwayClosable = afterInstance.some(item => item.meta.clickAwayClosable);

    return !afterHasAwayClosable;
  }

  return (
    <Portal namespace={namespace}>
      {mss && mask && (
        <Transition
          // 有遮罩时点击遮罩来关闭
          onClick={clickAwayClosable && close}
          toggle={show}
          type="fade"
          mountOnEnter
          unmountOnExit
          className={cls(maskTheme === 'dark' ? 'm78-mask-b' : 'm78-mask', maskClassName)}
          style={{ zIndex: nowZIndex }}
        />
      )}
      <Transition
        toggle={show}
        type={animationType}
        config={config.stiff}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        innerRef={contRef}
        className={cls('m78-modal-base', className)}
        style={{ ...style, left: pos[0], top: pos[1], zIndex: nowZIndex }}
      >
        <div className="m78-modal-base_calc-node" ref={bind} />
        <div style={{ width: 200, height: 160 }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aliquid atque cum
          cumque deleniti dolorem est, ex exercitationem harum iste magni maxime modi molestiae,
          non, nostrum obcaecati pariatur rem.
        </div>
      </Transition>
    </Portal>
  );
};

function Temp() {
  const [show, setShow] = useState(true);
  const [show2, setShow2] = useState(true);
  const [show3, setShow3] = useState(true);
  const [show4, setShow4] = useState(true);

  return (
    <div>
      <button
        onClick={() => {
          setShow(true);
          setShow2(true);
          setShow3(true);
          setShow4(true);
        }}
      >
        show
      </button>
      <ModalBase
        animationType="slideTop"
        style={{ border: '1px solid red' }}
        show={show}
        onChange={() => setShow(false)}
      />

      <ModalBase
        animationType="slideRight"
        style={{ border: '1px solid orange' }}
        show={show2}
        onChange={() => setShow2(false)}
      />

      <ModalBase
        animationType="slideBottom"
        style={{ border: '1px solid green' }}
        show={show3}
        onChange={() => setShow3(false)}
      />

      <ModalBase
        animationType="slideLeft"
        style={{ border: '1px solid blue' }}
        show={show4}
        onChange={() => setShow4(false)}
      />

      <div style={{ height: 2000 }} />
    </div>
  );
}

export default Temp;
