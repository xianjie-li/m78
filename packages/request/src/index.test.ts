// @ts-ignore
import { appRun } from "../mock/app-run";
import { createRequest } from "./index";
import { axiosAdapter, AxiosOptions } from "./adapter/axios";
import { FeedbackMode } from "./interfaces.js";

let server: any;

const HOST = "http://127.0.0.1:3456";

beforeAll(async () => {
  server = await appRun();
});

afterAll(() => {
  server.close();
});

describe("axios", () => {
  test("base", async () => {
    const request = createRequest<AxiosOptions>({
      adapter: axiosAdapter,
      baseOptions: {
        query: {
          abc: 1,
        },
      },
    });

    // success
    const res = await request(`${HOST}/user`);

    expect(res.data).toEqual({
      code: 0,
      data: {
        name: "lxj",
      },
      message: "请求成功!",
    });

    // error
    try {
      await request(`${HOST}/abcd`);
    } catch (e: any) {
      expect(e.message).toEqual("Error: Request failed with status code 404");
    }

    // base option
    const res2 = await request(`${HOST}/echo`);

    expect(res2.data.data).toEqual({ abc: "1" });
  });

  test("option", async () => {
    const feedBackFn = jest.fn();
    const startFn = jest.fn();
    const finishFn = jest.fn();
    const errorFn = jest.fn();
    const successFn = jest.fn();

    const request = createRequest<AxiosOptions>({
      adapter: axiosAdapter,
      checkStatus: (data) => data.code === 0,
      messageField: "message",
      feedBack: feedBackFn,
      format: (res) => res.data.data,
      start: startFn,
      finish: finishFn,
      error: errorFn,
      success: successFn,
    });

    const res = await request(`${HOST}/user`, {
      extraOption: {},
    });

    expect(res).toEqual({ name: "lxj" });

    try {
      await request(`${HOST}/error`);
    } catch (e: any) {
      expect(e.message).toBe("操作异常");
    }

    expect(feedBackFn.mock.calls.length).toBe(1);
    expect(feedBackFn.mock.calls[0][0]).toBe("操作异常");
    expect(feedBackFn.mock.calls[0][1]).toBe(false);
    expect(feedBackFn.mock.calls[0].length).toBe(4);

    expect(startFn.mock.calls.length).toBe(2);
    expect(startFn.mock.calls[0].length).toBe(1);
    expect(finishFn.mock.calls.length).toBe(2);
    expect(finishFn.mock.calls[0].length).toBe(2);

    expect(errorFn.mock.calls.length).toBe(1);
    expect(errorFn.mock.calls[0].length).toBe(2);

    expect(successFn.mock.calls.length).toBe(1);
    expect(successFn.mock.calls[0].length).toBe(3);

    try {
      await request(`${HOST}/user`, {
        extraOption: {
          checkStatus: (data) => data.code !== 0, // 取反
          messageField: "message",
          format: (response) => response.message,
          start: startFn,
          finish: finishFn,
          error: errorFn,
          success: successFn,
        },
      });
    } catch (e: any) {
      expect(e.message).toBe("请求成功!");
    }

    expect(startFn.mock.calls.length).toBe(3);
    expect(finishFn.mock.calls.length).toBe(3);
    expect(errorFn.mock.calls.length).toBe(2);
    expect(successFn.mock.calls.length).toBe(1);

    const res4 = await request(`${HOST}/echo-full`, {
      method: "POST",
      body: {
        a: 1,
      },
      query: {
        b: 2,
      },
      headers: {
        c: 3,
      },
      extraOption: {
        checkStatus: (data) => data.code === 0, // 取反
        format: (response) => response.data.data,
      },
    });

    expect(res4.query).toEqual({
      b: "2",
    });
    expect(res4.body).toEqual({
      a: 1,
    });
    expect(res4.headers).toMatchObject(
      expect.objectContaining({
        c: "3",
      })
    );
  });

  test("extraOption", async () => {
    const feedbackFn = jest.fn();

    const request = createRequest<AxiosOptions>({
      adapter: axiosAdapter,
      checkStatus: (data) => data.code === 0,
      messageField: "message",
      format: (res) => res.data.data,
      feedBack: (message, status) => feedbackFn(message, status),
    });

    await request(`${HOST}/echo`, {
      extraOption: {
        feedbackMode: FeedbackMode.all,
      },
    });

    expect(feedbackFn.mock.calls[0][0]).toBe("请求成功!");
    expect(feedbackFn.mock.calls[0][1]).toBe(true);

    await request(`${HOST}/error`).catch(() => {});

    expect(feedbackFn.mock.calls[1][0]).toBe("操作异常");
    expect(feedbackFn.mock.calls[1][1]).toBe(false);

    await request(`${HOST}/error`, {
      extraOption: {
        feedbackMode: FeedbackMode.none,
      },
    }).catch(() => {});

    expect(feedbackFn.mock.calls[1][0]).toBe("操作异常");
    expect(feedbackFn.mock.calls[1][1]).toBe(false);

    const res = await request(`${HOST}/echo`, {
      query: {
        name: "lxj",
      },
      extraOption: {
        format: (response) => response,
      },
    });

    expect(res.data.data).toEqual({
      name: "lxj",
    });

    await request(`${HOST}/echo`, {
      extraOption: {
        successMessage: "OKK",
      },
    });

    expect(feedbackFn.mock.calls[2][0]).toBe("OKK");
  });

  test("batch", async () => {
    const request = createRequest<AxiosOptions>({
      adapter: axiosAdapter,
      checkStatus: (data) => data.code === 0,
      messageField: "message",
      format: (res) => res.data.data,
    });

    const tasks = Array.from({ length: 20 }).map(() => {
      return request(`${HOST}/user`, {
        extraOption: {
          checkStatus: (data) => data.code === 0, // 取反
          messageField: "message",
          format: (response) => response.data.data,
        },
      });
    });

    const startTime = Date.now();

    const res = await Promise.all(tasks);

    const elapse = Date.now() - startTime;

    res.forEach((i) => {
      expect(i).toEqual({
        name: "lxj",
      });
    });

    // 耗时正常
    expect(elapse).toBeLessThan(3000);
  });

  // 理论上, 只要上面测试通过, 插件功能绝对没问题
  test.todo("plugin");
});
