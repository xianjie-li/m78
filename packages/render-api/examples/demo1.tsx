import React from "react";
import MyModalApi from "./my-modal-api";

const Demo1 = () => {
  function renderHandle() {
    // 每次render执行会返回一个RenderApiComponentInstance实例对象, 可以管理该实例的各种状态和行为
    const instance = MyModalApi.render({
      title: "这是modal的标题1",
      content: (
        <div>
          <div>这是model的内容</div>
          可以放置<strong>任意</strong>内容
        </div>
      ),
    });

    // render实例
    console.log(1, instance);

    // render所渲染组件对外暴露的示例, 调用后马上使用会为null
    // 如果组件未对外暴露任何东西则一直为null
    console.log(2, instance.current);

    // 如果要调用后马上访问组件实例, 使用safe方法
    instance.safe(() => {
      console.log(3, instance.current);
    });
  }

  return (
    <div>
      {/* 可以将api的渲染上下文放到当前react渲染树中，以支持Context等api */}
      {/* <MyModalApi.RenderTarget /> */}

      <div>
        <button onClick={renderHandle}>show modal 11</button>
        <button onClick={MyModalApi.disposeAll}>hide all</button>
      </div>
    </div>
  );
};

export default Demo1;
