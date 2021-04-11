import React from 'react';
import Popper, { PopperPropsCustom } from 'm78/popper';
import Button from 'm78/button';

import sty from './custom.module.scss';

function MyPopper(props: PopperPropsCustom) {
  const { content, setShow } = props;

  return (
    <div className={sty.MyPopper}>
      {content}
      <button type="button" onClick={() => setShow(false)}>
        关闭
      </button>
    </div>
  );
}

const Custom = () => {
  return (
    <div>
      <Popper customer={MyPopper} content="这是气泡内容">
        <Button>定制气泡</Button>
      </Popper>
    </div>
  );
};

export default Custom;
