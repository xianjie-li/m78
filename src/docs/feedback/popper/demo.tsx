import React, { useEffect } from 'react';
import Popper from '@lxjx/fr/lib/popper';
import Button from '@lxjx/fr/lib/button';
import sty from './demo.module.scss';

const Demo = () => {
  return (
    <div>
      <Popper>
        <Button>click</Button>
      </Popper>
    </div>
  );
};

export default Demo;
