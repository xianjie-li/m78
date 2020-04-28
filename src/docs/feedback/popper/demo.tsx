import React, {useEffect, useRef} from 'react';
import Popper from '@lxjx/fr/lib/popper';
import Button from '@lxjx/fr/lib/button';
import sty from './demo.module.scss';

const Demo = () => {
  const wrap = useRef<HTMLDivElement>(null!);

  return (
    <div>
      <div ref={wrap} className="wrap">
        <div className="inner">
          <Popper wrapEl={wrap}>
            <Button>click</Button>
          </Popper>
        </div>
      </div>
    </div>
  );
};

export default Demo;
