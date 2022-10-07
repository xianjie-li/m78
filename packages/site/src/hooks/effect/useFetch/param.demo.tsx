import React, { useState } from "react";
import { useFetch } from "@m78/hooks";

/**
 * 模拟一个基于Promise的请求函数
 */

function mockFn(payload: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ code: 0, data: payload });
    }, 500);
  });
}

const ParamDemo = () => {
  const [id, setId] = useState(1);

  const { data, loading, param } = useFetch(mockFn, {
    param: {
      name: "lxj",
      id,
    },
  });

  return (
    <div>
      <h3>ParamDemo {loading && "loading..."}</h3>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setId((prev) => prev + 1)}>
          change id {id}
        </button>
      </div>
      <div>
        <strong>current param:</strong> {JSON.stringify(param)}
      </div>
      <div>
        <strong>data</strong>
        <span style={{ fontSize: 14 }}>(返回请求时的参数):</span>{" "}
        {JSON.stringify(data)}
      </div>
    </div>
  );
};

export default ParamDemo;
