import React, { useState } from "react";
import MyModalApi from "./my-modal-api";

const Demo1 = () => {
  const [list, setList] = useState<any[]>([]);

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

    console.log(2, instance.name);
    console.log(2, instance.doSomething());

    setList((p) => [...p, instance]);
  }

  return (
    <div>
      {/* 可以将api的渲染上下文放到当前react渲染树中，以支持Context等api */}
      {/* <MyModalApi.RenderTarget /> */}

      <div>
        <button onClick={renderHandle}>show modal 11</button>
        <button onClick={MyModalApi.disposeAll}>hide all</button>
      </div>

      {list.map((i) => (
        <div>
          <div>{i.name} </div>
          <button onClick={() => i.open()}>open</button>
          <button onClick={() => i.close()}>close</button>
          <button
            onClick={() => {
              i.dispose();
              const ls = list.filter((item) => item !== i);
              setList(ls);
            }}
          >
            dispose
          </button>
        </div>
      ))}
    </div>
  );
};

export default Demo1;
