import React from "react";
import { createRequest } from "../../src";
import { axiosAdapter, AxiosOptions } from "../../src/adapter/axios";

// const request = createRequest<FetchOptions>({
//   adapter: fetchAdapter,
// });

const request = createRequest<AxiosOptions>({
  adapter: axiosAdapter,
  baseOptions: {
    timeout: 1000,
  },
});

export const Play = () => {
  function fetch1() {
    request("http://127.0.0.1:3456/user", {
      extraOption: {
        format: (res) => res.data.data,
      },
      timeout: 8000,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message, 22);
        console.log(err.response, 22);
      });
  }

  function fetch2() {
    request("http://127.0.0.1:3456/timeout", {
      extraOption: {},
      // timeout: 200,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message, 22);
        console.log(err.response, 22);
      });
  }

  return (
    <div>
      <button onClick={fetch1}>fetch1</button>
      <button onClick={fetch2}>fetch2</button>
    </div>
  );
};
