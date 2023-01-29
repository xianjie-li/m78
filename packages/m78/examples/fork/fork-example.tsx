import React from "react";
import { Divider } from "../../src/layout/index.js";
import { AsyncRender, If, Switch, Toggle } from "../../src/fork/index.js";
import { useFetch } from "@m78/hooks";
import { Button } from "../../src/index.js";

// 模拟一个有一定几率成功、失败、超时、无数据的请求接口
export const mockService = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const rand = Math.random();
      if (rand < 0.3) {
        rej(new Error("加载异常"));
        return;
      }
      // 模拟有无数据
      const data = Array.from({ length: Math.random() > 0.5 ? 0 : 8 }).map(() =>
        Math.random()
      );
      res(data);
    }, 1000);
  });
};

const ForkExample = () => {
  const meta = useFetch<number[]>(mockService, {
    timeout: Math.random() > 0.7 ? 500 : 8000, // 模拟超时状态
  });

  return (
    <div>
      <Divider>AsyncRender</Divider>

      <div className="mb-12">
        <Button type="button" disabled={meta.loading} onClick={meta.send}>
          发起请求
        </Button>
      </div>
      <AsyncRender hasData={meta.data?.length} {...meta}>
        {() => (
          <ul>
            {meta.data!.map((item) => (
              <li
                key={item}
                style={{
                  padding: "4px 12px",
                  border: "1px solid #eee",
                }}
              >
                rand num: {item}
              </li>
            ))}
          </ul>
        )}
      </AsyncRender>

      <Divider>If</Divider>
      <If when={true}>
        <div>你看到我了 1</div>
      </If>
      <If when={false}>
        <div>你看不到我 2</div>
      </If>
      <If when={0}>
        <div>你看不到我 3</div>
      </If>
      <If when={123}>
        <div>你看到我了 4</div>
      </If>
      <If when>{() => <div>render用法, 条件成立后才会创建Element</div>}</If>

      <Divider>Toggle</Divider>
      <Toggle when>
        <div>你看到我了1</div>
      </Toggle>
      <Toggle when={false}>
        <div>你看不到我2</div>
      </Toggle>
      <Toggle when={0}>
        <div>你看不到我3</div>
      </Toggle>
      <Toggle when={123}>
        <div>你看到我了4</div>
      </Toggle>
      <Toggle when={false}>
        如果子节点是字符串或一组ReactElement, 会使用一个div作为包裹节点来挂载
        display: none
      </Toggle>
      <Toggle when={false}>
        <div>你看不到我</div>
        <div>你看不到我</div>
        <div>你看不到我</div>
        <div>你看不到我</div>
        <div>你看不到我</div>
      </Toggle>

      <Divider>Switch</Divider>
      <div className="color-second">配合If</div>
      <Switch>
        <If when={false}>
          <div>你看不到我1</div>
        </If>
        <If when={false}>
          <div>你看不到我2</div>
        </If>
        <div>你看到我了3</div>
      </Switch>

      <div className="mt-32 color-second">配合toggle</div>
      <Switch>
        <Toggle when={false}>
          <div>你看不到我1</div>
        </Toggle>
        <Toggle when={false}>
          <div>你看不到我2</div>
        </Toggle>
        <Toggle when={123123}>
          <div>你看到我了3</div>
        </Toggle>
        <div>你看不到我4</div>
      </Switch>
    </div>
  );
};

export default ForkExample;
