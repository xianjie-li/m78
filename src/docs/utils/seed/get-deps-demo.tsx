import React from 'react';
import create from 'm78/seed';
import Button from 'm78/button';

const { setDeps, useState, State, getDeps } = create({
  /* 被所有验证器依赖数据 */
  dependency: {
    number: 0,
    time: Date.now(),
  },
  /* 声明验证器 */
  validators: {},
});

const GetDepsDemo = () => {
  /**
   * 省略selector参数会直接返回整个deps
   * hook只会在选取的值变更后更新组件、所以只获取需要的依赖值能大大减少render次数从而提升性能
   * */
  const dNumber = useState(deps => deps.number);
  const dTime = useState(deps => deps.time);

  return (
    <div>
      <Button size="small" onClick={() => setDeps({ number: Math.random() })}>
        change number
      </Button>
      <Button size="small" onClick={() => setDeps({ time: Date.now() })}>
        change time
      </Button>
      <Button size="small" onClick={() => alert(JSON.stringify(getDeps(), null, 4))}>
        获取deps
      </Button>

      <h3 className="mt-24">useDeps()</h3>
      <div className="fs-14 color-second mtb-12">通过useDeps()选取deps，这是最推荐的用法</div>

      <div>
        <div>number: {dNumber}</div>
        <div>time: {dTime}</div>
      </div>

      <h3 className="mt-24">Deps</h3>
      <div className="fs-14 color-second mtb-12">
        通过Deps组件获取deps，deps改变时，只有组件的render children区域更新，
        适合某个区域要显示部分deps的场景
      </div>

      <Deps>
        {({ number, time }) => (
          <div>
            <div>number: {number}</div>
            <div>time: {time}</div>
          </div>
        )}
      </Deps>
    </div>
  );
};

export default GetDepsDemo;
