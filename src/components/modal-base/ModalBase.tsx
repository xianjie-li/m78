import React, { useEffect, useRef, useState } from 'react';
import Portal from 'm78/portal';
import { calcAlignment } from 'm78/modal-base/commons';
import { useClickAway, useMeasure, useUpdateEffect } from 'react-use';
import { config, Transition } from '@lxjx/react-transition-spring';
import { useFormState, useLockBodyScroll, useSameState, useRefize } from '@lxjx/hooks';

import cls from 'classnames';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import { useLifeCycle } from 'm78/modal-base/lifeCycle';
import { ModalBaseProps, Share, TupleNumber } from './types';
import { useMethods } from './methods';

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
    onClose,
    children,
    triggerNode,
    baseZIndex = 1800,
  } = props;

  /** 内容区域容器 */
  const contRef = useRef<HTMLDivElement>(null!);

  /** 代理defaultShow/show/onClose, 实现对应接口 */
  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show',
  });

  /** 延迟设置为false的show，用于防止组件从实例列表中被生硬的移除(会打乱zIndex/动画状态等 ) */
  const delayShow = useDelayDerivedToggleStatus(show, 200, { trailing: true, leading: false });

  /** 所有show为true的Modal组件 */
  const [cIndex, instances] = useSameState('fr_modal_metas', delayShow, {
    mask,
    clickAwayClosable,
    namespace,
  });

  /** 当前组件应该显示的zIndex */
  const nowZIndex = cIndex === -1 ? baseZIndex : cIndex + baseZIndex;

  /** 监听容器大小变更 */
  const [bind, { width, height }] = useMeasure();

  /** 内容区域的xy坐标 */
  const [pos, setPos] = useState([0, 0]);

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
  };

  const methods = useMethods(share);

  useLifeCycle(share, methods);

  share.refState = useRefize({
    show,
    maskShouldShow: methods.maskShouldShow(),
    shouldTriggerClose: methods.shouldTriggerClose(),
  });

  return (
    <>
      {triggerNode && React.cloneElement(triggerNode, { onClick: methods.onTriggerNodeClick })}
      <Portal namespace={namespace}>
        {share.refState.maskShouldShow && mask && (
          <Transition
            // 有遮罩时点击遮罩来关闭
            onClick={clickAwayClosable && methods.close}
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
          style={{
            ...style,
            left: pos[0],
            top: pos[1],
            zIndex: nowZIndex,
          }}
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
        alignment={[0.3, 0.3]}
      >
        <div style={{ width: 300 }}>
          <ModalBase
            animationType="slideBottom"
            className="card"
            triggerNode={<button type="button">click</button>}
            alignment={[0.7, 0.7]}
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
