import React, { useRef } from 'react';
import Popper from '@lxjx/fr/lib/popper';

const Demo = () => {
  const wrap = useRef<HTMLDivElement>(null!);

  function renderContent() {
    return (
      <div>
        <div>气泡内容123123气泡内容12312</div>
        <div>气泡内容123123气泡内容12312</div>
        <div>气泡内容123123气泡内容12312</div>
        <div>气泡内容123123气泡内容12312</div>
        <div>气泡内容123123气泡内容12312</div>
      </div>
    );
  }

  return (
    <div>
      <div ref={wrap} className="wrap">
        <div className="inner">
          <Popper trigger="hover" wrapEl={wrap} content={renderContent()}>
            <button type="button" style={{ margin: 160 }}>
              click
            </button>
          </Popper>
        </div>
      </div>
    </div>
  );
};

export default Demo;
