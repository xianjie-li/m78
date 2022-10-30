import create, { Middleware } from "./index";

test("create", () => {
  const kit = create({
    state: {
      user: "lxj",
      age: 18,
    },
  });

  expect(kit).toMatchObject({
    set: expect.any(Function),
    subscribe: expect.any(Function),
    get: expect.any(Function),
  });
});

test("update & getState", () => {
  const kit = create({
    state: {
      user: "lxj",
      age: 18,
    },
  });

  expect(kit.get()).toEqual({
    user: "lxj",
    age: 18,
  });

  kit.set({
    user: "jxl",
  });

  expect(kit.get()).toEqual({
    user: "jxl",
    age: 18,
  });

  kit.coverSet({
    user: "xxx",
    age: 20,
  });

  expect(kit.get()).toEqual({
    user: "xxx",
    age: 20,
  });
});

test("subscribe & unSubscribe", () => {
  const kit = create({
    state: {
      user: "lxj",
      age: 18,
    },
  });

  const ls1 = jest.fn(() => {});
  const ls2 = jest.fn(() => {});

  const usLs1 = kit.subscribe(ls1);

  kit.set({
    age: 19,
  });

  usLs1();

  kit.subscribe(ls2);

  kit.set({
    age: 18,
  });

  usLs1();

  expect(ls1).toHaveBeenCalledTimes(1);
  expect(ls2).toHaveBeenCalledTimes(1);
  expect(ls1).toHaveBeenLastCalledWith({
    age: 19,
  });
  expect(ls2).toHaveBeenLastCalledWith({
    age: 18,
  });
});

test("middleware", () => {
  expect.assertions(3); // 两次patch是否执行、1次初始配置更改是否成功

  const mid1: Middleware = (bonus) => {
    if (bonus.init) {
      const conf = bonus.config;
      const deps = conf.state;

      return { ...conf, state: { ...deps, field3: "hello" } };
    }

    bonus.monkey("set", (next) => (patch) => {
      expect(true).toBe(true);
      next(patch);
    });
  };

  const mid2: Middleware = (bonus) => {
    if (bonus.init) {
      const conf = bonus.config;
      const deps = conf.state;

      return { ...conf, state: { ...deps, field4: "world" } };
    }

    bonus.monkey("subscribe", (next) => (listener) => {
      expect(true).toBe(true);
      return next(listener);
    });
  };

  const kit = create({
    middleware: [mid1, mid2],
    state: {
      user: "lxj",
      age: 18,
    },
  });

  expect(kit.get()).toEqual({
    user: "lxj",
    age: 18,
    field3: "hello",
    field4: "world",
  });

  kit.set({
    user: "jxl",
  });

  kit.subscribe(() => {});
});
