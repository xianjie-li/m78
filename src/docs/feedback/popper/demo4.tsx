import React, { useEffect, useRef } from 'react';
import Popper from '@lxjx/fr/popper';
import Button from '@lxjx/fr/button';

import sty from './demo.module.scss';

const Demo4 = () => {
  const wrap = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    wrap.current.scrollTop = 780;
    wrap.current.scrollLeft = 810;
  }, []);

  return (
    <div ref={wrap} className={sty.box}>
      <div className={sty.innerBox}>
        <Popper
          title="提示"
          show
          // wrapEl={wrap}
          content={
            <div>
              <div>提示提示提示提示</div>
              <div>提示提示提示提示</div>
              <div>提示提示提示提示</div>
            </div>
          }
        >
          <Button>BTN</Button>
        </Popper>
      </div>
    </div>
  );
};

export default Demo4;
