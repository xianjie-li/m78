import create from "@m78/seed";
import {
  create as createPermission,
  createPro,
  CreatePermissionConfig,
} from "./index.js";

describe("auth", () => {
  const getAuth = (conf?: Partial<CreatePermissionConfig>) => {
    const seed = create({
      state: {
        verify: false,
        usr: {
          name: "lxj",
          audit: true,
          vip: false,
        },
      },
    });

    return createPermission({
      ...conf,
      seed,
      validators: {
        verify({ verify }) {
          if (!verify) {
            return {
              label: "not verify",
              desc: "Basic information is not verified",
            };
          }
        },
        login({ usr }) {
          if (!usr) {
            return {
              label: "not log",
              desc: "Please log in first",
            };
          }
        },
        audit({ usr }) {
          if (!usr.audit) {
            return {
              label: "not audit",
              desc: "User is not audit",
            };
          }
        },
        vip({ usr }) {
          if (!usr.vip) {
            return {
              label: "not vip",
              desc: "User is not vip",
            };
          }
        },
        self({ usr }, extra) {
          if (usr && usr.name !== extra) {
            return {
              label: "not self",
              desc: "Can only be operated by self",
            };
          }
        },
      },
    });
  };

  test("base", () => {
    const auth = getAuth();

    const rej = auth(["login", "vip", "audit"]);
    expect(rej).toEqual([
      {
        label: "not vip",
        desc: "User is not vip",
      },
    ]);
  });

  test("or", () => {
    const auth = getAuth();

    const rej = auth(["login", ["vip", "audit"]]);

    expect(rej).toBe(null);
  });

  test("extra", () => {
    const auth = getAuth();

    const rej = auth(["self"], { extra: "lxj" });

    expect(rej).toBe(null);
  });

  test("local validators & validFirst", () => {
    const auth = getAuth({ validFirst: true });

    const rej = auth(["isJxl", "self"], {
      extra: 1,
      validators: {
        isJxl(deps, extra) {
          if (deps.usr.name !== "jxl") {
            return {
              label: `Must be jxl${extra}`,
            };
          }
        },
      },
    });

    expect(rej).toEqual([{ label: "Must be jxl1" }]);
  });
});

describe("authPro", () => {
  const pm = {
    user: ["create", "update", "delete"],
    news: ["create", "update", "delete"],
  };

  test("api", () => {
    const ap = createPro({
      seed: create(),
      permission: pm, // init
    });

    expect(ap).toMatchObject({
      check: expect.any(Function),
      seed: expect.any(Object),
      permission: expect.any(Function),
    });

    expect(ap.seed.get().permission).toEqual(pm);
  });

  test("check()", () => {
    const ap = createPro({
      seed: create(),
      meta: {
        each: (meta) => {
          meta.desc = "这是一段扩展的权限描述";
          return meta;
        },
        general: [
          {
            label: "更新4",
            key: "update4",
          },
        ],
        modules: {
          user: {
            label: "用户",
            list: [
              {
                label: "更新5",
                key: "update5",
              },
            ],
          },
        },
      },
      permission: pm,
    });

    expect(ap.check(["user:create"])).toBe(null);
    expect(ap.check(["user:create23|create525|create5152|update&create"])).toBe(
      null
    );
    expect(ap.check(["user:create23&create525&create5152&update|create"])).toBe(
      null
    );
    expect(ap.check(["user:create&update"])).toBe(null);
    expect(ap.check(["user:create222|update"])).toBe(null);
    expect(ap.check(["user:create2&update2|create"])).toBe(null);
    expect(ap.check(["user:create|update2&create"])).toBe(null);
    expect(ap.check(["user:create|update2|delete&create|create|update2"])).toBe(
      null
    );
    expect(ap.check(["user:create&(update|update2)"])).toBe(null);
    expect(ap.check(["user:(create|update22)&update)"])).toBe(null);
    expect(ap.check(["user:create", ["user:create1", "news:create"]])).toBe(
      null
    );
    expect(ap.check(["user:create&(update2|update3|update4|update5)"])).toEqual(
      [
        {
          label: "用户",
          module: "user",
          missing: [
            {
              label: "update2",
              key: "update2",
              desc: "这是一段扩展的权限描述",
            },
            {
              label: "update3",
              key: "update3",
              desc: "这是一段扩展的权限描述",
            },
            {
              key: "update4",
              label: "更新4",
              desc: "这是一段扩展的权限描述",
            },
            {
              key: "update5",
              label: "更新5",
              desc: "这是一段扩展的权限描述",
            },
          ],
        },
      ]
    );
  });
});
