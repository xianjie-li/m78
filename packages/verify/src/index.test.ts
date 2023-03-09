import {
  array,
  createVerify,
  number,
  object,
  regexp,
  required,
  SchemaWithoutName,
  string,
} from "./index.js";
import { fmtValidator, SOURCE_ROOT_NAME } from "./common.js";
import { VerifyError } from "./error.js";

const verify = createVerify();

describe("base", () => {
  test("api", () => {
    expect(verify).toStrictEqual({
      check: expect.any(Function),
      asyncCheck: expect.any(Function),
      getRejectMessage: expect.any(Function),
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
      .catch((err) => {
        expect(err).not.toBeNull();
        if (err instanceof VerifyError) {
          expect(err.rejects?.length).toBe(1);
          expect(err.rejects?.[0]?.name).toBe("user");
        }
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

  test("ignoreStrangeValue", () => {
    const verify2 = createVerify({
      verifyFirst: false,
      ignoreStrangeValue: false,
    });

    const schema: SchemaWithoutName = {
      validator: required(),
      schema: [
        {
          name: "name",
        },
        {
          name: "things",
          eachSchema: {
            schema: [
              {
                name: "title",
              },
            ],
          },
        },
        {
          name: "obj",
          schema: [
            {
              name: "objf1",
            },
          ],
        },
        {
          name: "arr2",
          schema: [
            {
              name: 0,
            },
          ],
        },
      ],
    };

    const reject = verify2.check(
      {
        name: "lxj",
        things: [
          {
            title: "thing1",
            content: "123123",
          },
        ],
        obj: {
          objf1: "123",
          objf2: "123",
        },
        arr2: [1, 2],
      },
      schema
    );

    expect(reject!.map((i) => i.message)).toEqual([
      "Has an unexpected field: things[0].content",
      "Has an unexpected field: obj.objf2",
      "Has an unexpected field: arr2[1]",
    ]);

    const reject2 = verify2.check(
      {
        name: "lxj",
        things: [
          {
            title: "thing1",
            content: "123123",
          },
        ],
        obj: {
          objf1: "123",
          objf2: "123",
        },
        arr2: [1, 2],
        abc: "!23",
      },
      schema
    );
  });
});
