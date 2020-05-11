import React, { useRef } from 'react';
import Popper from '@lxjx/fr/lib/popper';

const Demo = () => {
  const wrap = useRef<HTMLDivElement>(null!);

  function renderContent() {
    return (
      <div>
        <div>气泡内容123123气泡内容12312气泡内容气泡内</div>
      </div>
    );
  }

  return (
    <div>
      <div ref={wrap} className="wrap">
        <div className="inner">
          <Popper
            type="study"
            title="一个无关紧要的气泡"
            trigger="click"
            // wrapEl={wrap}
            content={renderContent()}
            defaultShow
            studyKey="test"
            studyData={[
              {
                title: '操作1',
                desc: '看这个按钮',
                selector: '#btnss',
              },
              {
                title: '操作2',
                desc: '这是一个logo',
                selector: '.__dumi-default-menu-logo',
                img:
                  'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1569843302,3093165589&fm=26&gp=0.jpg',
              },
              {
                title: '操作3',
                desc: '这是你正在阅读内容的标题',
                selector: '#基础示例 > a',
              },
            ]}
          />

          <button id="btnss" type="button" style={{ margin: 300 }}>
            click
          </button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
