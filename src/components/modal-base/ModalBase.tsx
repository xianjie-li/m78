import React, { useEffect, useRef, useState } from 'react';
import { ModalBaseProps, TupleNumber } from 'm78/modal-base/types';
import Portal from 'm78/portal';
import { calcAlignment } from 'm78/modal-base/commons';
import { useClickAway, useMeasure, useUpdateEffect } from 'react-use';
import { config, Transition } from '@lxjx/react-transition-spring';
import { useFormState, useLockBodyScroll, useSameState, useRefize } from '@lxjx/hooks';

import cls from 'classnames';
import { useDelayDerivedToggleStatus } from 'm78/hooks';

// modal的基础层级 ref: @lxjx\sass-base\var.scss line 128>
const MODAL_Z_INDEX = 1800;

/** model的默认位置 */
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
    children,
    triggerNode,
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
  const delayShow = useDelayDerivedToggleStatus(show, 200, { trailing: true, leading: false });

  const [cIndex, instances] = useSameState('fr_modal_metas', delayShow, {
    mask,
    clickAwayClosable,
  });

  const nowZIndex = cIndex === -1 ? MODAL_Z_INDEX : cIndex + MODAL_Z_INDEX;

  /** 监听大小 */
  const [bind, { width, height }] = useMeasure();

  /** 内容区域的xy坐标 */
  const [pos, setPos] = useState([0, 0]);

  const refState = useRefize({
    show,
    maskShouldShow: maskShouldShow(),
    shouldTriggerClose: shouldTriggerClose(),
  });

  // 滚动锁定
  useLockBodyScroll(lockScroll && show);

  // 无遮罩时，通过ClickAway来触发关闭，需要延迟一定的时间，因为用户设置的Modal开关可能会与ClickAway区域重叠
  useClickAway(contRef, () => {
    if (!show) return;

    if (
      // 可点击关闭 + 无mask
      (clickAwayClosable && !mask) ||
      // 应触发点击关闭 + mask未显示
      (refState.shouldTriggerClose && !refState.maskShouldShow)
    ) {
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
    if (!show || !contRef.current) return;

    // useMeasure获取的尺寸是无边框尺寸，这里手动获取带边框等的实际尺寸
    const w = contRef.current.offsetWidth;
    const h = contRef.current.offsetHeight;

    const screenMeta: TupleNumber = [window.innerWidth - w, window.innerHeight - h];

    setPos(calcAlignment(alignment, screenMeta));
  }

  function close() {
    if (refState.shouldTriggerClose) {
      setShow(false);
      onClose?.();
    }
  }

  function open() {
    setShow(true);
  }

  /** 根据该组件所有已渲染实例判断是否应开启mask */
  function maskShouldShow() {
    if (!mask || !show) return false;

    // 当前实例之前所有实例组成的数组
    const beforeInstance = instances.slice(0, cIndex);

    // 在该实例之前是否有任意一个实例包含mask
    const beforeHasMask = beforeInstance.some(item => item.meta.mask);

    return !beforeHasMask;
  }

  /** 根据前后实例判断是否需要触发Away点击关闭 */
  function shouldTriggerClose() {
    if (!show || !clickAwayClosable) return false;

    // 当前实例之前所有实例组成的数组
    const afterInstance = instances.slice(cIndex + 1);

    // 在该实例之前是否有任意一个实例包含mask
    const afterHasAwayClosable = afterInstance.some(item => item.meta.clickAwayClosable);

    return !afterHasAwayClosable;
  }

  function sameAniTypeCount() {}

  function onTriggerNodeClick(e: MouseEvent) {
    triggerNode?.props?.onClick?.(e);
    refState.show ? close() : open();
  }

  return (
    <>
      {triggerNode && React.cloneElement(triggerNode, { onClick: onTriggerNodeClick })}
      <Portal namespace={namespace}>
        {refState.maskShouldShow && mask && (
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
          {children}
        </Transition>
      </Portal>
    </>
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
        animationType="slideRight"
        className="card"
        triggerNode={<button type="button">click</button>}
      >
        <div style={{ width: 300 }}>
          <ModalBase
            animationType="slideBottom"
            className="card"
            triggerNode={<button type="button">click</button>}
          >
            <div style={{ width: 300 }}>
              <ModalBase
                animationType="slideLeft"
                className="card"
                triggerNode={<button type="button">click</button>}
              >
                <div style={{ width: 300 }}>
                  <ModalBase
                    animationType="zoom"
                    className="card"
                    triggerNode={<button type="button">click</button>}
                  >
                    <div style={{ width: 300 }}>
                      <ModalBase
                        animationType="bounce"
                        className="card"
                        triggerNode={<button type="button">click</button>}
                      >
                        <div style={{ width: 300 }}>
                          4 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium
                          alias, aspernatur assumenda deleniti dolorem enim eos, error, eveniet
                          excepturi ipsam iusto laudantium minima neque obcaecati quaerat quas qui
                          reprehenderit totam!
                        </div>
                      </ModalBase>
                      4 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias,
                      aspernatur assumenda deleniti dolorem enim eos, error, eveniet excepturi ipsam
                      iusto laudantium minima neque obcaecati quaerat quas qui reprehenderit totam!
                    </div>
                  </ModalBase>
                  3 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias,
                  aspernatur assumenda deleniti dolorem enim eos, error, eveniet excepturi ipsam
                  iusto laudantium minima neque obcaecati quaerat quas qui reprehenderit totam!
                </div>
              </ModalBase>
              2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias,
              aspernatur assumenda deleniti dolorem enim eos, error, eveniet excepturi ipsam iusto
              laudantium minima neque obcaecati quaerat quas qui reprehenderit totam!
            </div>
          </ModalBase>
          1 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias, aspernatur
          assumenda deleniti dolorem enim eos, error, eveniet excepturi ipsam iusto laudantium
          minima neque obcaecati quaerat quas qui reprehenderit totam!
        </div>
      </ModalBase>

      {/* <ModalBase */}
      {/*  animationType="slideRight" */}
      {/*  style={{ border: '1px solid orange' }} */}
      {/*  show={show2} */}
      {/*  onChange={() => setShow2(false)} */}
      {/* > */}
      {/*  <div style={{ width: 300 }}> */}
      {/*    2 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam aspernatur dolorum, */}
      {/*    earum eligendi error excepturi exercitationem fugit inventore maxime nam necessitatibus */}
      {/*    pariatur possimus, ullam vel voluptas! Corporis illum porro provident! */}
      {/*  </div> */}
      {/* </ModalBase> */}

      {/* <ModalBase */}
      {/*  animationType="slideBottom" */}
      {/*  style={{ border: '1px solid green' }} */}
      {/*  show={show3} */}
      {/*  onChange={() => setShow3(false)} */}
      {/* > */}
      {/*  <div style={{ width: 300 }}> */}
      {/*    3 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi at dignissimos dolorem, */}
      {/*    eius iusto maiores molestias obcaecati perspiciatis quae quia quis repellat saepe tempora */}
      {/*    temporibus tenetur vitae voluptas. Exercitationem, in. */}
      {/*  </div> */}
      {/* </ModalBase> */}

      {/* <ModalBase */}
      {/*  animationType="slideLeft" */}
      {/*  style={{ border: '1px solid blue' }} */}
      {/*  show={show4} */}
      {/*  onChange={() => setShow4(false)} */}
      {/* > */}
      {/*  <div style={{ width: 300 }}> */}
      {/*    4 Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id recusandae veritatis vero. */}
      {/*    Animi deleniti harum voluptas. Aliquid deserunt eveniet exercitationem id molestias odit */}
      {/*    reprehenderit saepe. Beatae exercitationem fuga optio quis! */}
      {/*  </div> */}
      {/* </ModalBase> */}

      <div style={{ height: 2000 }} />
    </div>
  );
}

export default Temp;
