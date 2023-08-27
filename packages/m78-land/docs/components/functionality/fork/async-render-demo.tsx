import React from "react";
import { useFetch } from "@m78/hooks";
import { Button, AsyncRender } from "m78";

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

const AsyncRenderDemo = () => {
  const meta = useFetch<number[]>(mockService, {
    timeout: Math.random() > 0.7 ? 500 : 8000, // 模拟超时状态
  });

  return (
    <div>
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
    </div>
  );
};

export default AsyncRenderDemo;
