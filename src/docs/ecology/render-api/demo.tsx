import React from 'react';
import { Button } from 'm78/button';
import MyModalApi from './my-modal-api';

const Demo = () => {
  function renderHandle() {
    // 每次render执行会返回一个RenderApiComponentInstance实例对象, 可以管理该实例的各种状态和行为
    const instance = MyModalApi.render({
      title: '这是modal的标题1',
      content: (
        <div>
          <div>这是model的内容</div>
          可以放置<strong>任意</strong>内容
        </div>
      ),
    });

    console.log(instance);
  }

  return (
    <div>
      {/* 可以选择将api的渲染上下文放到当前react渲染树中，以支持Context等api */}
      {/* <MyModalApi.RenderBoxTarget /> */}

      <div>
        <Button onClick={renderHandle}>show modal</Button>
        <Button onClick={MyModalApi.disposeAll}>销毁全部</Button>
      </div>
    </div>
  );
};

export default Demo;
