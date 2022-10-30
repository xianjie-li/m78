import {
  array,
  createVerify,
  number,
  object,
  regexp,
  required,
  string,
} from "./index";
import { fmtValidator, SOURCE_ROOT_NAME } from "./common";

const verify = createVerify();

describe("base", () => {
  test("api", () => {
    expect(verify).toStrictEqual({
      check: expect.any(Function),
      asyncCheck: expect.any(Function),
      languagePack: expect.any(Object),
    });
  });

  test("check", () => {
    const reject = verify.check(
      {
        user: "lxj",
        sex: undefined,
      },
      {
        validator: required(),
        schema: [
          {
            name: "user",
            validator: [required()],
          },
          {
            name: "sex",
            validator: [required()],
          },
        ],
      }
    );

    expect(reject).not.toBeNull();
    expect(reject?.length).toBe(1);
    expect(reject?.[0]?.name).toBe("sex");
    expect(typeof reject?.[0]?.message).toBe("string");

    expect(
      verify.check(
        {
          user: "lxj",
        },
        {
          validator: required(),
          schema: [
            {
              name: "user",
              validator: [required()],
            },
          ],
        }
      )
    ).toBeNull();
  });

  test("asyncCheck", () => {
    return verify
      .asyncCheck(
        {
          user: "",
          sex: 1,
        },
        {
          validator: required(),
          schema: [
            {
              name: "user",
              validator: [required()],
            },
            {
              name: "sex",
              validator: [required()],
            },
          ],
        }
      )
      .catch((reject) => {
        expect(reject).not.toBeNull();
        expect(reject?.length).toBe(1);
        expect(reject?.[0]?.name).toBe("user");
      });
  });

  test("meta", () => {
    const reject = verify.check(
      {
        user: "lxj",
      },
      {
        validator: [required()],
        schema: [
          {
            name: "user",
            validator: [() => "reject"],
          },
        ],
      },
      {
        extraMeta: {
          extraProps: 1,
        },
      }
    );

    expect(reject?.[0]).toMatchObject({
      verify: expect.any(Object),
      name: "user",
      label: "user",
      value: "lxj",
      values: {
        user: "lxj",
      },
      schema: {
        name: "user",
        validator: [expect.any(Function)],
      },
      rootSchema: {
        name: SOURCE_ROOT_NAME,
        validator: [expect.any(Function)],
      },
      getValueByName: expect.any(Function),
      config: {
        verifyFirst: expect.any(Boolean),
        languagePack: expect.any(Object),
      },
      extraProps: 1,
    });
  });

  test("schema & config", () => {
    const verify2 = createVerify({
      verifyFirst: false,
      languagePack: {
        required: "not be null",
      },
    });

    const reject = verify2.check(
      {
        user: "lxj",
        sex: "1",
      },
      {
        validator: required(),
        schema: [
          {
            name: "user",
            label: "用户",
            validator: string({
              length: 2,
            }),
          },
          {
            name: "nonExists",
            validator: required(),
          },
          {
            name: "sex",
            label: "性别",
            validator: [
              number({
                size: 1,
              }),
            ],
            transform: (val) => Number(val),
          },
        ],
      }
    );

    expect(reject?.length).toBe(2);
    expect(reject?.[0].label).toBe("用户");
    expect(reject?.[0].message).toBe("The length can only be 2");
    expect(reject?.[1].message).toBe("not be null");
  });

  test("child schema & eachSchema", () => {
    const verify2 = createVerify({
      verifyFirst: false,
    });

    const rejects = verify2.check(
      {
        name: "lxj",
        list: ["1", "2", 3],
        map: {
          field1: "123",
          field2: 123,
        },
        listMap: [
          {
            key: "123",
          },
          {
            key: 123,
          },
        ],
        listList: [["xxx"], ["xxx"], 123, [123]],
      },
      {
        validator: required(),
        schema: [
          {
            name: "name",
            validator: [string({ length: 4 })],
          },
          {
            name: "list",
            validator: [array()],
            eachSchema: {
              validator: [string()],
            },
          },
          {
            name: "map",
            validator: [object()],
            schema: [
              {
                name: "field1",
                validator: [number()],
              },
              {
                name: "field2",
                validator: [string()],
              },
            ],
          },
          {
            name: "listMap",
            validator: [array()],
            eachSchema: {
              validator: [object()],
              schema: [
                {
                  name: "key",
                  validator: [number()],
                },
              ],
            },
          },
          {
            name: "listList",
            validator: [array()],
            eachSchema: {
              validator: [array()],
              eachSchema: {
                validator: [number()],
              },
            },
          },
        ],
      }
    );

    expect(rejects?.length).toBe(8);
  });

  test("argument", () => {
    function fn(...args: [string, number]) {
      const rejects = verify.check(args, {
        validator: required(),
        schema: [
          {
            name: "0",
            validator: [required()],
          },
          {
            name: "1",
            validator: [required()],
          },
        ],
      });

      expect(rejects?.length).toBe(1);
    }

    // @ts-ignore
    fn("123");
  });

  test("root value", () => {
    const rej = verify.check([], {
      validator: required(),
      schema: [
        {
          name: "0",
          validator: required(),
        },
      ],
    });

    expect(rej?.[0].name).toBe(SOURCE_ROOT_NAME);
  });

  test("single check", () => {
    const rej = verify.check(161, {
      validator: number({
        min: 150,
        max: 160,
      }),
    });

    expect(rej?.[0].message).toBe("Cannot be greater than 160");
  });

  test("optional", () => {
    const rej = verify.check(null, {
      validator: [
        number({
          min: 150,
          max: 160,
        }),
      ],
    });

    expect(rej).toBeNull();
  });

  test("validator format", () => {
    const _required = required();
    const _number = number();
    const _regexp = regexp();

    const list = fmtValidator(
      [_required, undefined, _number, null, _regexp, undefined],
      true
    );

    expect(list).toEqual([_required]);

    const list2 = fmtValidator(
      [undefined, _number, null, _regexp, _required, undefined],
      true
    );

    expect(list2).toEqual([_required]);

    const list3 = fmtValidator(
      [undefined, _number, null, _regexp, _required, undefined],
      false
    );

    expect(list3).toEqual([_number, _regexp, _required]);
  });
});
