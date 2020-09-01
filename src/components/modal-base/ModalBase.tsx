import React, { useEffect, useRef, useState } from 'react';
import Portal from 'm78/portal';
import { useMeasure } from 'react-use';
import { config, Transition } from '@lxjx/react-transition-spring';
import { useFormState, useSameState, useRefize, useSelf } from '@lxjx/hooks';
import { useSpring, animated, interpolate } from 'react-spring';

import cls from 'classnames';
import { useDelayDerivedToggleStatus, useMountInterface } from 'm78/hooks';
import { useLifeCycle } from 'm78/modal-base/lifeCycle';
import { log } from 'util';
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

  const self = useSelf({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
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
  };

  const methods = useMethods(share);

  useLifeCycle(share, methods);

  share.refState = useRefize({
    show,
    maskShouldShow: methods.maskShouldShow(),
    shouldTriggerClose: methods.shouldTriggerClose(),
  });

  const [sp, set] = useSpring(() => ({ x: 0, y: 0, scale: 0 }));

  const [mount, setMount] = useMountInterface(show, { mountOnEnter, unmountOnExit });

  const show2 = useDelayDerivedToggleStatus(show, 1, { trailing: false, leading: true });

  useEffect(() => {
    if (show) {
      setMount(true);
    }
  }, [show]);

  useEffect(() => {
    console.log(contRef.current);

    if (show) {
      // methods.calcPos();

      self.x = (window as any)._FR_LAST_CLICK_POSITION_X || self.px || 0;
      self.y = (window as any)._FR_LAST_CLICK_POSITION_Y || self.px || 0;

      self.startXPos = self.x - self.px - contRef.current.offsetWidth / 2;
      self.startYPos = self.y - self.py - contRef.current.offsetHeight / 2;

      (set as any)({
        to: async (next: any) => {
          await next({
            x: self.startXPos,
            y: self.startYPos,
            scale: 0,
            immediate: true,
            reset: true,
          });
          await next({
            x: 0,
            y: 0,
            scale: 1,
            immediate: false,
            config: { ...config.stiff, clamp: false },
            reset: false,
          });
        },
      });
    } else {
      set({
        x: self.startXPos,
        y: self.startYPos,
        scale: 0,
        immediate: false,
        config: { ...config.stiff, clamp: true },
        reset: false,
        onRest() {
          if (!share.refState.show) {
            console.log('ff1');

            setMount(false);
          }
        },
      });
      self.x = 0;
      self.y = 0;
    }
    // eslint-disable-next-line
  }, [show2]);

  function renderCont() {
    if (animationType === 'fromMouse') {
      return (
        mount && (
          <animated.div
            ref={contRef}
            className={cls('m78-modal-base', className)}
            style={{
              ...style,
              left: pos[0],
              top: pos[1],
              zIndex: nowZIndex,
              transform: interpolate(
                //  @ts-ignore
                [sp.x, sp.y, sp.scale],
                (x: number, y: number, scale: number) =>
                  `translate3d(${x}px,${y}px, 0px) scale3d(${scale},${scale},${scale})`,
              ),
            }}
          >
            <div className="m78-modal-base_calc-node" ref={bind} />
            {children}
          </animated.div>
        )
      );
    }

    return (
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
    );
  }

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
        {renderCont()}
      </Portal>
    </>
  );
};

const timer: any = null;

/** 保存鼠标最后点击相对中心点的偏移位置 */
function windowClickHandle(e: MouseEvent) {
  if (timer) {
    clearTimeout(timer);
  }

  const x = e.x || e.screenX; // screenX会有导航栏高度的偏移
  const y = e.y || e.screenY;

  (window as any)._FR_LAST_CLICK_POSITION_X = x;
  (window as any)._FR_LAST_CLICK_POSITION_Y = y;

  // timer = setTimeout(() => {
  //   console.log(123);
  //   (window as any)._FR_LAST_CLICK_POSITION_X = undefined;
  //   (window as any)._FR_LAST_CLICK_POSITION_Y = undefined;
  // }, 3000);
}

/**
 * 在组件内记忆位置会导致以api形式调用时组件未装载从而无法获得鼠标位置，故将记忆位置的逻辑放到Base中, 也可以减少事件绑定
 * 如果不提前调用此方法，ShowFromMouse永远都只会从页面中心出现
 * */
function registerPositionSave() {
  window.removeEventListener('click', windowClickHandle, true);
  // 启用事件捕获防止某个元素事件冒泡导致事件不触发
  window.addEventListener('click', windowClickHandle, true);
}

registerPositionSave();

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
        animationType="fromMouse"
        className="card"
        defaultShow={false}
        triggerNode={
          <button type="button" style={{ marginLeft: 400, marginTop: 600 }}>
            click
          </button>
        }
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
