import React, { useEffect, useRef, useState } from 'react';
import { ModalBaseProps, TupleNumber } from 'm78/modal-base/types';
import Portal from 'm78/portal';
import { calcAlignment } from 'm78/modal-base/commons';
import { useClickAway, useMeasure } from 'react-use';
import { config, Transition } from '@lxjx/react-transition-spring';
import { useFormState } from '@lxjx/hooks';

// @lxjx\sass-base\var.scss line 128>
const MODAL_Z_INDEX = 1800;

const DEFAULT_ALIGN: TupleNumber = [0.5, 0.5];

const ModalBase: React.FC<ModalBaseProps> = props => {
  const {
    namespace,
    alignment = DEFAULT_ALIGN,
    mask,
    maskTheme,
    animationType = 'fade',
    mountOnEnter = true,
    unmountOnExit = false,
  } = props;

  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onClose',
    valueKey: 'show',
  });

  const [bind, { width, height }] = useMeasure();

  const [pos, setPos] = useState([0, 0]);

  useEffect(() => {
    calcPos();
  }, [width, height]);

  /** 屏幕尺寸改变/容器尺寸改变时调用 */
  function calcPos() {
    const screenMeta: TupleNumber = [window.innerWidth - width, window.innerHeight - height];

    setPos(calcAlignment(alignment, screenMeta));
  }

  function onClose() {
    setShow(false);
  }

  return (
    <Portal namespace={namespace}>
      {mask && (
        <Transition
          onClick={onClose}
          toggle={show}
          type="fade"
          // className={cls('m78-mask-node', dark ? 'm78-mask-b' : 'm78-mask')}
          mountOnEnter
          unmountOnExit
          className={maskTheme === 'dark' ? 'm78-mask-b' : 'm78-mask'}
          style={{ zIndex: MODAL_Z_INDEX }}
        />
      )}
      <Transition
        toggle={show}
        type={animationType}
        config={config.stiff}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
        className="m78-modal-base"
        style={{ left: pos[0], top: pos[1] }}
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
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>show</button>
      <ModalBase show={show} onChange={() => setShow(false)} maskTheme="dark" />
    </div>
  );
}

export default Temp;
