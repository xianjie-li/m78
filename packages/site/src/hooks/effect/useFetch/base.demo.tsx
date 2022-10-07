import React, { useState } from "react";
import { useFetch } from "@m78/hooks";

/**
 * 模拟一个基于Promise的请求函数
 */
function mockFn(delay = 1500, isSuccess = false, res?: any) {
  return (/* ...arg: any */) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        isSuccess ? resolve(res || delay) : reject(res || delay);
      }, delay);
    });
  };
}

const UseFetchBase = () => {
  const [count, setCount] = useState(0);
  const [hasError, setError] = useState(false);
  const [hasTimeout, setTimeout] = useState(false);
  const [hasPoll, setPoll] = useState(false);

  const { data, loading, error, timeout, send, payload, cancel } = useFetch(
    mockFn(hasTimeout ? 5000 : 1000, !hasError, {
      name: "lxj",
      bd: "1994-08",
      timer: Date.now(),
    }),
    {
      initPayload: { score: Math.random().toFixed(2) }, // 传递给请求方法的初始参数
      deps: [count], // 依赖值发生改变时会自动以当前参数更新请求
      timeout: 3000, // 超时时间
      pollingInterval: hasPoll ? 2000 : 0, // 轮询时间
      cacheKey: "USEFETCHCHACHEKEY", // 开启缓存、SWR
    },
  );

  const retry = (
    <span onClick={send} style={{ color: "#1561c4", fontSize: 14 }}>
      重试
    </span>
  );

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={send}>通过send进行更新</button>
        <button onClick={() => send({ score: Math.random().toFixed(2) })}>
          send传入payload进行更新
        </button>
        <button onClick={() => setCount((prev) => prev + 1)}>
          通过改变deps更新 {count}
        </button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setError((prev) => !prev)}>
          下次为错误请求 {hasError.toString()}
        </button>
        <button onClick={() => setTimeout((prev) => !prev)}>
          下次为超时请求 {hasTimeout.toString()}
        </button>
      </div>
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setPoll((prev) => !prev)}>
          轮询开关 {hasPoll.toString()}
        </button>
        <button onClick={cancel}>取消该次请求</button>
      </div>
      <div>
        <strong>data:</strong> <div>{JSON.stringify(data, null, 4)}</div>
      </div>
      <div>
        <strong>loading:</strong> {loading && <span>⏱loading...</span>}
      </div>
      <div>
        <strong>error:</strong>
        {error && (
          <div>
            {JSON.stringify(error)} {retry}
          </div>
        )}
      </div>
      <div>
        <strong>timeout:</strong> {timeout && <span>timeout{retry}</span>}
      </div>
      <div>
        <strong>payload</strong>
        <span style={{ fontSize: 14 }}>(作为参数传给请求方法)</span>:
        {JSON.stringify(payload)}
      </div>
      <p style={{ fontSize: 14, color: "rgba(0,0,0,0.45)" }}>
        * 当传入了 cacheKey
        后，会自动开启SWR(stale-while-revalidate)，当arg、data、payload发生变更时会将其缓存到session中，
        下次组件初始化时，会先读取缓存数据进行返回，然后再发起更新请求并替换掉"stale"的数据，
        <span style={{ color: "rgba(0,0,0,0.75)" }}>
          刷新页面并查看data的变化来查看SWR的效果
        </span>
      </p>

      <p style={{ fontSize: 14, color: "rgba(0,0,0,0.45)" }}>
        * 竞态?,
        与通常意义上的竞态稍有不同（Promise.race等），使用useFetch时，后发起的请求会覆盖掉先发起的请求,
        即使该请求发生了错误或其他异常
      </p>
    </div>
  );
};

export default UseFetchBase;
