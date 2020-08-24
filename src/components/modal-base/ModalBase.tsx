import React, { useEffect, useState } from 'react';
import { ModalBaseProps } from 'm78/modal-base/types';
import Portal from 'm78/portal';
import { calcAlignment } from 'm78/modal-base/commons';
import { useMeasure } from 'react-use';

// @lxjx\sass-base\var.scss line 128>
const MODAL_Z_INDEX = 1800;

const testAlign = [0.5, 0.5];

const ModalBase: React.FC<ModalBaseProps> = ({ namespace }) => {
  const [bind, { width, height }] = useMeasure();

  const [pos, setPos] = useState([0, 0]);

  useEffect(() => {
    calcPos();
  }, [width, height]);

  /** 屏幕尺寸改变/容器尺寸改变时调用 */
  function calcPos() {
    const screenMeta = [window.innerWidth - width, window.innerHeight - height];

    setPos(calcAlignment(testAlign, screenMeta));
  }

  console.log(width, height);

  return (
    <Portal namespace={namespace}>
      <div className="m78-mask" style={{ zIndex: MODAL_Z_INDEX }} />
      <div className="m78-modal-base" style={{ left: pos[0], top: pos[1] }}>
        <div className="m78-modal-base_calc-node" ref={bind} />
        <div style={{ width: 200, height: 160 }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusantium aliquid atque cum
          cumque deleniti dolorem est, ex exercitationem harum iste magni maxime modi molestiae,
          non, nostrum obcaecati pariatur rem.
        </div>
      </div>
    </Portal>
  );
};

export default ModalBase;
