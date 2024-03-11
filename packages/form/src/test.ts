import {
  array,
  number,
  object,
  regexp,
  required,
  string,
} from "./validator/index.js";
import { jest } from "@jest/globals";
import { createForm, createVerify, FormSchemaWithoutName } from "./index.js";
import { _fmtValidator } from "./schema-check/common.js";

// form功能测试
describe("form-vanilla", () => {
  test("root single value test", async () => {
    const form = createForm({
      values: 1,
      schemas: {
        validator: [required(), string()],
      },
    });

    const [rejects] = await form.verify();

    expect(rejects!.map((i: any) => i.message)).toEqual(["Must be a string"]);
  });

  test("root array test", async () => {
    const form = createForm({
      values: [1, 2, 3, "4"],
      schemas: {
        eachSchema: {
          validator: [required(), number()],
        },
      },
    });

    const [rejects] = await form.verify();

    expect(rejects!.map((i: any) => i.message)).toEqual(["Must be a number"]);
  });

  test("all round test", async () => {
    const form = createForm({
      autoVerify: false,
      values: {
        filed1: "m78 form",
        nestObjField1: {
          name: "nestObjField1-name",
          desc: "nestObjField1-desc",
        },
        nestArrayFiled1: [1, 2, 3],
        nestArrayFiled2: [
          {
            title: "nestArrayFiled2-1",
          },
          {
            title: "nestArrayFiled2-2",
          },
        ],
        nestDeepField1: {
          nestDeepField1_1: {
            nestDeepField1_1_1: {
              title: "nestDeepTitle",
            },
          },
        },
      },
      schemas: {
        schemas: [
          {
            name: "nestArrayFiled1",
            validator: [
              required(),
              array({
                min: 4,
              }),
            ],
          },
          {
            name: "nestArrayFiled2",
            eachSchema: {
              schemas: [
                {
                  name: "title",
                },
              ],
            },
          },
          {
            name: "nestDeepField1",
            schemas: [
              {
                name: "nestDeepField1_1",
                schemas: [
                  {
                    name: "nestDeepField1_1_1",
                    schemas: [
                      {
                        name: "title",
                        validator: [required()],
                      },
                      {
                        name: "desc",
                        validator: [required()],
                        valid: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    const updateCB = jest.fn();
    const changeCB = jest.fn();
    const failCB = jest.fn();
    const submitCB = jest.fn();
    const resetCB = jest.fn();

    form.events.update.on(form.notifyFilter("filed1", updateCB));
    form.events.change.on(form.notifyFilter("filed1", changeCB));
    form.events.update.on(form.notifyFilter(["nestArrayFiled1", 1], updateCB));
    form.events.change.on(form.notifyFilter(["nestArrayFiled1", 1], changeCB));
    form.events.reset.on(resetCB);
    form.events.submit.on(submitCB);
    form.events.fail.on(failCB);

    // 简单字段/数组字段/深层字段测试
    form.setValue("filed1", "m78 form2");
    form.setValue(["nestArrayFiled1", 1], 4);
    form.setValue(
      ["nestDeepField1", "nestDeepField1_1", "nestDeepField1_1_1", "title"],
      "nestDeepTitle1"
    );

    // getValue(s)
    expect(form.getValue("filed1")).toBe("m78 form2");
    expect(form.getValue(["nestArrayFiled1", 1])).toBe(4);
    expect(
      form.getValue([
        "nestDeepField1",
        "nestDeepField1_1",
        "nestDeepField1_1_1",
        "title",
      ])
    ).toBe("nestDeepTitle1");

    expect(form.getValues()).toEqual({
      filed1: "m78 form2",
      nestObjField1: {
        name: "nestObjField1-name",
        desc: "nestObjField1-desc",
      },
      nestArrayFiled1: [1, 4, 3],
      nestArrayFiled2: [
        {
          title: "nestArrayFiled2-1",
        },
        {
          title: "nestArrayFiled2-2",
        },
      ],
      nestDeepField1: {
        nestDeepField1_1: {
          nestDeepField1_1_1: {
            title: "nestDeepTitle1",
          },
        },
      },
    });

    form.setValues({
      filed1: "m78 form3",
      nestObjField1: {
        name: "nestObjField1-name",
        desc: "nestObjField1-desc",
      },
      nestArrayFiled1: [1, 4, 3],
      nestArrayFiled2: [
        {
          title: "nestArrayFiled2-1",
        },
        {
          title: "nestArrayFiled2-2",
        },
      ],
      nestDeepField1: {
        nestDeepField1_1: {
          nestDeepField1_1_1: {
            title: "nestDeepTitle1",
          },
        },
      },
    });

    expect(form.getValues()).toEqual({
      filed1: "m78 form3",
      nestObjField1: {
        name: "nestObjField1-name",
        desc: "nestObjField1-desc",
      },
      nestArrayFiled1: [1, 4, 3],
      nestArrayFiled2: [
        {
          title: "nestArrayFiled2-1",
        },
        {
          title: "nestArrayFiled2-2",
        },
      ],
      nestDeepField1: {
        nestDeepField1_1: {
          nestDeepField1_1_1: {
            title: "nestDeepTitle1",
          },
        },
      },
    });

    expect(updateCB.mock.calls.length).toBe(4);
    expect(changeCB.mock.calls.length).toBe(4);

    // touched/changed
    expect(form.getTouched("filed1")).toBe(true);
    expect(form.getTouched(["nestArrayFiled1", 1])).toBe(true);
    expect(
      form.getTouched([
        "nestDeepField1",
        "nestDeepField1_1",
        "nestDeepField1_1_1",
        "title",
      ])
    ).toBe(true);
    expect(form.getFormTouched()).toBe(true);

    expect(form.getChanged("filed1")).toBe(true);
    expect(form.getChanged(["nestArrayFiled1", 1])).toBe(true);
    expect(
      form.getChanged([
        "nestDeepField1",
        "nestDeepField1_1",
        "nestDeepField1_1_1",
        "title",
      ])
    ).toBe(true);
    expect(form.getFormTouched()).toBe(true);

    form.setValue("filed1", "m78 form");
    expect(updateCB.mock.calls.length).toBe(5);
    form.setValue(["nestArrayFiled1", 1], 2);
    expect(updateCB.mock.calls.length).toBe(6);
    form.setValue(
      ["nestDeepField1", "nestDeepField1_1", "nestDeepField1_1_1", "title"],
      "nestDeepTitle"
    );
    expect(updateCB.mock.calls.length).toBe(6);

    expect(form.getTouched("filed1")).toBe(true);
    expect(form.getTouched(["nestArrayFiled1", 1])).toBe(true);
    expect(
      form.getTouched([
        "nestDeepField1",
        "nestDeepField1_1",
        "nestDeepField1_1_1",
        "title",
      ])
    ).toBe(true);
    expect(form.getFormTouched()).toBe(true);

    expect(form.getChanged("filed1")).toBe(false);
    expect(form.getChanged(["nestArrayFiled1", 1])).toBe(false);
    expect(
      form.getChanged([
        "nestDeepField1",
        "nestDeepField1_1",
        "nestDeepField1_1_1",
        "title",
      ])
    ).toBe(false);
    expect(form.getFormChanged()).toBe(false);

    expect(updateCB.mock.calls.length).toBe(6);
    expect(changeCB.mock.calls.length).toBe(6);

    // reset & defaultValues
    form.reset();

    expect(updateCB.mock.calls.length).toBe(8);
    expect(changeCB.mock.calls.length).toBe(8);

    expect(form.getTouched("filed1")).toBe(false);
    expect(form.getTouched(["nestArrayFiled1", 1])).toBe(false);
    expect(
      form.getTouched([
        "nestDeepField1",
        "nestDeepField1_1",
        "nestDeepField1_1_1",
        "title",
      ])
    ).toBe(false);
    expect(form.getFormTouched()).toBe(false);

    expect(form.getValues()).toEqual({
      filed1: "m78 form",
      nestObjField1: {
        name: "nestObjField1-name",
        desc: "nestObjField1-desc",
      },
      nestArrayFiled1: [1, 2, 3],
      nestArrayFiled2: [
        {
          title: "nestArrayFiled2-1",
        },
        {
          title: "nestArrayFiled2-2",
        },
      ],
      nestDeepField1: {
        nestDeepField1_1: {
          nestDeepField1_1_1: {
            title: "nestDeepTitle",
          },
        },
      },
    });

    form.setDefaultValues({
      filed1: "m78 form",
    });

    form.reset();

    expect(form.getValues()).toEqual({
      filed1: "m78 form",
    });

    expect(resetCB.mock.calls.length).toBe(2);

    expect(updateCB.mock.calls.length).toBe(10);
    expect(changeCB.mock.calls.length).toBe(10);

    {
      const [rejects] = await form.verify();

      expect(rejects!.map((i: any) => `${i.name}:${i.message}`)).toEqual([
        "nestArrayFiled1:Required",
        "nestDeepField1.nestDeepField1_1.nestDeepField1_1_1.title:Required",
      ]);
    }

    expect(updateCB.mock.calls.length).toBe(12);
    expect(changeCB.mock.calls.length).toBe(10);

    form.setValue("nestArrayFiled1", [1, 2, 3]);

    expect(updateCB.mock.calls.length).toBe(13);
    expect(changeCB.mock.calls.length).toBe(11);

    {
      const [rejects] = await form.verify("nestArrayFiled1");

      expect(rejects!.map((i: any) => `${i.name}:${i.message}`)).toEqual([
        "nestArrayFiled1:No less than 4 items",
      ]);
    }

    expect(
      form
        .getErrors("nestArrayFiled1")
        .map((i: any) => `${i.name}:${i.message}`)
    ).toEqual(["nestArrayFiled1:No less than 4 items"]);

    expect(updateCB.mock.calls.length).toBe(13);
    expect(changeCB.mock.calls.length).toBe(11);

    form.setValue("nestArrayFiled1", [1, 2, 3, 4]);
    form.setValue(
      ["nestDeepField1", "nestDeepField1_1", "nestDeepField1_1_1", "title"],
      "abcd"
    );

    expect(updateCB.mock.calls.length).toBe(14);
    expect(changeCB.mock.calls.length).toBe(12);

    await form.verify();

    form.setSchemas({
      schemas: [
        {
          name: "nestArrayFiled1",
          validator: [required(), object()],
        },
      ],
    });

    {
      const [rejects] = await form.submit();

      expect(rejects!.map((i: any) => `${i.name}:${i.message}`)).toEqual([
        "nestArrayFiled1:Must be a regular object",
      ]);
    }

    expect(
      form
        .getErrors("nestArrayFiled1")
        .map((i: any) => `${i.name}:${i.message}`)
    ).toEqual(["nestArrayFiled1:Must be a regular object"]);

    form.setValue("nestArrayFiled1", { name: "A" });

    await form.submit();

    expect(form.getErrors("nestArrayFiled1")).toEqual([]);

    expect(submitCB.mock.calls.length).toBe(1);
  });

  test("dynamic & valid", async () => {
    const form = createForm({
      values: {
        field1: "abc",
        field2: [1, 2, 3],
        field3: {
          field3_1: "111",
          field3_2: "222",
        },
        field4: [
          {
            title: "111",
          },
          {
            title: "222",
          },
        ],
      },
      schemas: {
        validator: required(),
        schemas: [
          {
            name: "field2",
            dynamic: ({ form }) => {
              if (form.getValue("field1") === "abc") {
                return {
                  validator: [required(), array({ min: 4 })],
                };
              }

              if (form.getValue("field1") === "abcd") {
                return {
                  validator: [required(), object()],
                };
              }
            },
          },
          {
            name: "field3",
            dynamic: ({ form }) => ({
              valid: form.getValue("field1") !== "abcd",
              schemas:
                form.getValue("field1") === "abcd"
                  ? undefined
                  : [
                      {
                        name: "field3_1",
                        valid: false,
                      },
                    ],
            }),
          },
          {
            name: "field5",
            // @ts-ignore 测试extraValidGetter
            disabled: true,
          },
        ],
      },
    });

    const [rejects] = await form.verify();

    expect(rejects!.map((i: any) => `${i.name}:${i.message}`)).toEqual([
      "field2:No less than 4 items",
    ]);

    expect(form.getValues()).toEqual({
      field1: "abc",
      field2: [1, 2, 3],
      field3: {
        field3_2: "222",
      },
      field4: [
        {
          title: "111",
        },
        {
          title: "222",
        },
      ],
    });

    form.setValue("field1", "abcd");

    {
      const [rejects] = await form.verify();

      expect(rejects!.map((i: any) => `${i.name}:${i.message}`)).toEqual([
        "field2:Must be a regular object",
      ]);
    }

    expect(form.getValues()).toEqual({
      field1: "abcd",
      field2: [1, 2, 3],
      field4: [
        {
          title: "111",
        },
        {
          title: "222",
        },
      ],
    });

    form.setValue("field1", "abc");

    expect(form.getValues()).toEqual({
      field1: "abc",
      field2: [1, 2, 3],
      field3: {
        field3_2: "222",
      },
      field4: [
        {
          title: "111",
        },
        {
          title: "222",
        },
      ],
    });
  });

  test("list", async () => {
    const form = createForm({
      values: {
        noList: "abc",
        list1: [1, 2, 3],
        list2: [
          {
            title: "1",
          },
        ],
      },
      schemas: {
        schemas: [
          {
            name: "noList",
          },
          {
            name: "list1",
            list: true,
          },
          {
            name: "list2",
            list: true,
          },
        ],
      },
    });

    const updateCB = jest.fn();
    const changeCB = jest.fn();

    form.events.update.on(form.notifyFilter("list1", updateCB));
    form.events.change.on(form.notifyFilter("list1", changeCB));

    expect(form.getList("noList")).toBe(null);
    expect(form.getList("list1")?.length).toBe(3);
    expect(form.getList("list2")?.length).toBe(1);
    expect(form.getList("list1")?.map((i) => i.item)).toEqual([1, 2, 3]);

    const keysBackup = form.getList("list1")!.map((i) => i.key);

    form.listSwap("list1", 0, 2);

    expect(form.getList("list1")![0].key).toBe(keysBackup[2]);
    expect(form.getList("list1")![2].key).toBe(keysBackup[0]);

    form.listSwap("list1", 0, 2);
    form.listMove("list1", 0, 2);

    expect(form.getList("list1")![0].key).toBe(keysBackup[1]);
    expect(form.getList("list1")![1].key).toBe(keysBackup[2]);
    expect(form.getList("list1")![2].key).toBe(keysBackup[0]);

    form.listRemove("list1", 1);

    expect(form.getList("list1")?.length).toBe(2);

    form.listAdd("list1", [5, 6, 7]);

    expect(form.getList("list1")?.map((i) => i.item)).toEqual([2, 1, 5, 6, 7]);

    expect(updateCB.mock.calls.length).toBe(5);
    expect(changeCB.mock.calls.length).toBe(5);

    // root list
    const form2 = createForm({
      values: [1, 2, 3],
      schemas: {
        list: true,
      },
    });

    const keys = form2.getList([])!.map((i) => i.key);
    const list = form2.getList([])!.map((i) => i.item);

    expect(keys.length).toEqual(3);
    expect(list).toEqual([1, 2, 3]);

    form2.listSwap([], 0, 2);

    expect(keys[0]).toEqual(form2.getList([])![2].key);
    expect(keys[2]).toEqual(form2.getList([])![0].key);

    form2.listAdd([], [5, 5, 5], 2);

    expect(form2.getList([])!.map((i) => i.item)).toEqual([3, 2, 5, 5, 5, 1]);
    expect(keys[0]).toEqual(form2.getList([])![5].key);
  });

  test("nest list change", () => {
    // nest list change
    const form3 = createForm({
      values: {
        list: [
          {
            title: "1",
            list2: [1, 2, 3],
          },
          {
            title: "2",
            list2: [1, 2, 3],
          },
          {
            title: "3",
            list2: [1, 2, 3],
          },
        ],
      },
      schemas: {
        schemas: [
          {
            name: "list",
            list: true,
            eachSchema: {
              schemas: [
                {
                  name: "list2",
                  list: true,
                },
              ],
            },
          },
        ],
      },
    });

    const form3List00Keys = form3
      .getList(["list", 0, "list2"])!
      .map((i) => i.key);
    const form3List01Keys = form3
      .getList(["list", 1, "list2"])!
      .map((i) => i.key);
    const form3List02Keys = form3
      .getList(["list", 2, "list2"])!
      .map((i) => i.key);

    form3.listSwap(["list", 1, "list2"], 0, 2);

    expect(form3.getList(["list", 1, "list2"])!.map((i) => i.key)[2]).toBe(
      form3List01Keys[0]
    );
    expect(form3.getList(["list", 1, "list2"])!.map((i) => i.key)[0]).toBe(
      form3List01Keys[2]
    );

    form3.listSwap(["list", 1, "list2"], 0, 2);

    expect(form3List01Keys).toEqual(
      form3.getList(["list", 1, "list2"])!.map((i) => i.key)
    );

    // 测试切换父级list索引后自己顺序是否会同步

    expect(form3.getList(["list", 0, "list2"])!.map((i) => i.key)).toEqual(
      form3List00Keys
    );
    expect(form3.getList(["list", 1, "list2"])!.map((i) => i.key)).toEqual(
      form3List01Keys
    );
    expect(form3.getList(["list", 2, "list2"])!.map((i) => i.key)).toEqual(
      form3List02Keys
    );

    form3.listSwap("list", 0, 2);

    expect(form3.getList(["list", 0, "list2"])!.map((i) => i.key)).toEqual(
      form3List02Keys
    );

    expect(form3.getList(["list", 2, "list2"])!.map((i) => i.key)).toEqual(
      form3List00Keys
    );

    expect(form3.getList(["list", 1, "list2"])!.map((i) => i.key)).toEqual(
      form3List01Keys
    );

    form3.listAdd("list", [{ title: "abc" }, { title: "efg" }], 0);

    expect(form3.getList(["list", 2, "list2"])!.map((i) => i.key)).toEqual(
      form3List02Keys
    );

    expect(form3.getList(["list", 4, "list2"])!.map((i) => i.key)).toEqual(
      form3List00Keys
    );

    expect(form3.getList(["list", 3, "list2"])!.map((i) => i.key)).toEqual(
      form3List01Keys
    );

    expect(form3.getList(["list"])!.length).toEqual(5);
  });

  test("getChangedValues", () => {
    const form = createForm({
      values: {
        field1: "abc",
        filed2: "efg",
        // field3: xx, 不存在的字段测试
        list1: [1, 2, 3],
        list2: [
          {
            title: "1",
          },
          {
            title: "2",
          },
          {
            title: "3",
          },
        ],
        obj: {
          field1: "abc",
          filed2: "efg",
        },
        delFiled: "del",
        delList: [
          {
            title: "1",
          },
          {
            title: "2",
          },
        ],
        delObj: {
          field1: "abc",
          filed2: "efg",
        },
      },
      schemas: {},
    });

    expect(form.getChangedValues()).toEqual(null);

    form.setValue("field1", "abc1");

    expect(form.getChangedValues()).toEqual({ field1: "abc1" });

    form.setValue("field3", "");

    expect(form.getChangedValues()).toEqual({ field1: "abc1" });

    form.setValue(["list1", 1], 5);
    form.setValue(["list2", 1, "title"], "55");

    expect(form.getChangedValues()).toEqual({
      field1: "abc1",
      list1: [1, 5, 3],
      list2: [{ title: "1" }, { title: "55" }, { title: "3" }],
    });

    form.setValue(["obj", "filed2"], "efg1");

    expect(form.getChangedValues()).toEqual({
      field1: "abc1",
      list1: [1, 5, 3],
      list2: [{ title: "1" }, { title: "55" }, { title: "3" }],
      obj: {
        field1: "abc",
        filed2: "efg1",
      },
    });

    form.setValue("delFiled", "");

    expect(form.getChangedValues()).toEqual({
      field1: "abc1",
      list1: [1, 5, 3],
      list2: [{ title: "1" }, { title: "55" }, { title: "3" }],
      obj: {
        field1: "abc",
        filed2: "efg1",
      },
      delFiled: "",
    });

    form.setValue(["delObj"], undefined);

    expect(form.getChangedValues()).toEqual({
      field1: "abc1",
      list1: [1, 5, 3],
      list2: [{ title: "1" }, { title: "55" }, { title: "3" }],
      obj: {
        field1: "abc",
        filed2: "efg1",
      },
      delFiled: "",
      delObj: null,
    });

    form.setValue("delList", undefined);
    form.setValue("delObj", undefined);

    expect(form.getChangedValues()).toEqual({
      field1: "abc1",
      list1: [1, 5, 3],
      list2: [{ title: "1" }, { title: "55" }, { title: "3" }],
      obj: {
        field1: "abc",
        filed2: "efg1",
      },
      delFiled: "",
      delList: null,
      delObj: null,
    });
  });
});

// 验证独立测试
describe("verify", () => {
  test("check", async () => {
    const verify = createVerify({
      schemas: {
        validator: required(),
        schemas: [
          {
            name: "user",
            validator: [required()],
          },
          {
            name: "sex",
            validator: [required()],
          },
        ],
      },
    });

    const [reject] = await verify.check({
      user: "lxj",
      sex: undefined,
    });

    expect(reject).not.toBeNull();
    expect(reject?.length).toBe(1);
    expect(reject?.[0]?.name).toBe("sex");
    expect(typeof reject?.[0]?.message).toBe("string");

    const verify2 = createVerify({
      schemas: {
        validator: required(),
        schemas: [
          {
            name: "user",
            validator: [required()],
          },
        ],
      },
    });

    expect(
      (
        await verify2.check({
          user: "lxj",
        })
      )[0]
    ).toBeNull();
  });

  test("asyncCheck", async () => {
    const verify = createVerify({
      schemas: {
        validator: required(),
        schemas: [
          {
            name: "user",
            validator: [required()],
          },
          {
            name: "sex",
            validator: [required()],
          },
        ],
      },
    });

    const [rejects] = await verify.check({
      user: "",
      sex: 1,
    });

    expect(rejects).not.toBeNull();

    expect(rejects?.length).toBe(1);
    expect(rejects?.[0]?.name).toBe("user");
  });

  test("meta", async () => {
    const verify = createVerify({
      schemas: {
        validator: [required()],
        schemas: [
          {
            name: "user",
            validator: [() => "reject"],
          },
        ],
      },
    });

    const [reject] = await verify.check(
      {
        user: "lxj",
      },
      {
        extraProps: 1,
      }
    );

    expect(reject?.[0]).toMatchObject({
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

  test("schema & config", async () => {
    const verify2 = createVerify({
      verifyFirst: false,
      languagePack: {
        required: "not be null",
      },
      schemas: {
        validator: required(),
        schemas: [
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
      },
    });

    const [reject] = await verify2.check({
      user: "lxj",
      sex: "1",
    });

    expect(reject?.length).toBe(2);
    expect(reject?.[0].label).toBe("用户");
    expect(reject?.[0].message).toBe("The length can only be 2");
    expect(reject?.[1].message).toBe("not be null");
  });

  test("getSchemasDetail", async () => {
    const verify2 = createVerify({
      schemas: {
        validator: required(),
        schemas: [
          {
            name: "user",
            label: "用户",
            validator: string({
              length: 2,
            }),
            dynamic: () => ({
              valid: false,
            }),
          },
          {
            name: "nonExists",
            validator: required(),
            valid: false,
          },
        ],
      },
    });

    expect(verify2.getSchemas().invalidNames).toEqual([
      ["user"],
      ["nonExists"],
    ]);
  });

  test("getSchemasDetail", async () => {
    const verify2 = createVerify({
      schemas: {
        validator: required(),
        schemas: [
          {
            name: "user",
            label: "用户",
            validator: string({
              length: 2,
            }),
            dynamic: () => ({
              valid: false,
            }),
          },
          {
            name: "nonExists",
            validator: required(),
            valid: false,
          },
        ],
      },
    });

    expect(verify2.getSchemas().invalidNames).toEqual([
      ["user"],
      ["nonExists"],
    ]);
  });

  test("getRootSchema", async () => {
    const verify2 = createVerify({
      schemas: {
        validator: required(),
        dynamic: () => ({
          label: "abc",
        }),
        schemas: [
          {
            name: "user",
            label: "用户",
            validator: string({
              length: 2,
            }),
            dynamic: () => ({
              valid: false,
            }),
          },
          {
            name: "nonExists",
            validator: required(),
            valid: false,
          },
        ],
      },
    });

    expect(verify2.getSchemas().schemas!.label).toBe("abc");
  });

  test("child schema & eachSchema", async () => {
    const verify2 = createVerify({
      verifyFirst: false,
      schemas: {
        validator: required(),
        schemas: [
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
            schemas: [
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
              schemas: [
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
      },
    });

    const [rejects] = await verify2.check({
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
    });

    expect(rejects?.length).toBe(8);
  });

  test("argument", () => {
    async function fn(...args: [string, number]) {
      const verify = createVerify({
        verifyFirst: false,
        languagePack: {
          required: "not be null",
        },
        schemas: {
          validator: required(),
          schemas: [
            {
              name: "0",
              validator: [required()],
            },
            {
              name: "1",
              validator: [required()],
            },
          ],
        },
      });

      const [rejects] = await verify.check(args);

      expect(rejects?.length).toBe(1);
    }

    // @ts-ignore
    return fn("123");
  });

  test("root value", async () => {
    const verify = createVerify({
      verifyFirst: false,
      languagePack: {
        required: "not be null",
      },
      schemas: {
        validator: required(),
        schemas: [
          {
            name: "0",
            validator: required(),
          },
        ],
      },
    });

    const [rej] = await verify.check([]);

    expect(rej?.[0].name).toBe("[]");
  });

  test("single check", async () => {
    const verify = createVerify({
      schemas: {
        validator: number({
          min: 150,
          max: 160,
        }),
      },
    });

    const [rej] = await verify.check(165);

    expect(rej?.[0].message).toBe("Cannot be greater than 160");
  });

  test("optional", async () => {
    const verify = createVerify({
      schemas: {
        validator: [
          number({
            min: 150,
            max: 160,
          }),
        ],
      },
    });

    const [rej] = await verify.check(null);

    expect(rej).toBeNull();
  });

  test("validator format", () => {
    const _required = required();
    const _number = number();
    const _regexp = regexp();

    const list = _fmtValidator(
      [_required, undefined, _number, null, _regexp, undefined],
      true
    );

    expect(list).toEqual([_required]);

    const list2 = _fmtValidator(
      [undefined, _number, null, _regexp, _required, undefined],
      true
    );

    expect(list2).toEqual([_required]);

    const list3 = _fmtValidator(
      [undefined, _number, null, _regexp, _required, undefined],
      false
    );

    expect(list3).toEqual([_number, _regexp, _required]);
  });

  test("ignoreStrangeValue", async () => {
    const schema: FormSchemaWithoutName = {
      validator: required(),
      schemas: [
        {
          name: "name",
        },
        {
          name: "things",
          eachSchema: {
            schemas: [
              {
                name: "title",
              },
            ],
          },
        },
        {
          name: "obj",
          schemas: [
            {
              name: "objf1",
            },
          ],
        },
        {
          name: "arr2",
          schemas: [
            {
              name: 0,
            },
          ],
        },
      ],
    };

    const verify2 = createVerify({
      verifyFirst: false,
      ignoreStrangeValue: false,
      schemas: schema,
    });

    const [reject] = await verify2.check({
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
    });

    expect(reject!.map((i) => i.message)).toEqual([
      "Has an unexpected field: things[0].content",
      "Has an unexpected field: obj.objf2",
      "Has an unexpected field: arr2[1]",
    ]);

    const [reject2] = await verify2.check({
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
    });

    expect(reject2?.map((i) => i.message)).toEqual([
      "Has an unexpected field: abc",
      "Has an unexpected field: things[0].content",
      "Has an unexpected field: obj.objf2",
      "Has an unexpected field: arr2[1]",
    ]);
  });

  test("dynamic schema", async () => {
    const verify = createVerify({
      schemas: {
        schemas: [
          {
            name: "count",
            dynamic: ({ form }) => {
              return {
                validator:
                  form.getValue("num") === 1
                    ? [required(), number()]
                    : [required(), string()],
              };
            },
          },
          {
            name: "list",
            dynamic: ({ form }) => {
              if (form.getValue("type") === 1) {
                return {
                  validator: [number()],
                };
              }
              return {
                eachSchema: {
                  validator: number(),
                },
              };
            },
          },
        ],
      },
    });

    const [rej] = await verify.check({
      num: 1,
      count: 2,
    });

    expect(rej?.[0].message).toBeUndefined();

    const [rej2] = await verify.check({
      num: 2,
      count: 2,
    });

    expect(rej2?.[0].message).toBe("Must be a string");

    const [rej3] = await verify.check({
      num: 1,
      count: 2,
      type: 1,
      list: [1, 2, 3],
    });

    expect(rej3?.[0].message).toBe("Must be a number");

    const [rej4] = await verify.check({
      num: 1,
      count: 2,
      type: 2,
      list: [1, 2, 3],
    });

    expect(rej4?.[0].message).toBeUndefined();

    // dynamic get each item name
    const verify2 = createVerify({
      schemas: {
        eachSchema: {
          dynamic: ({ namePath }) => {
            return {
              valid: namePath[0] !== 1,
            };
          },
        },
      },
    });

    const [, data] = await verify2.check([1, 2, 3]);

    expect(data).toEqual([1, 3]);

    // dynamic get each item name
    const verify3 = createVerify({
      schemas: {
        schemas: [
          {
            name: "list",
            eachSchema: {
              dynamic: ({ namePath }) => {
                return {
                  valid: namePath[namePath.length - 1] !== 1,
                };
              },
            },
          },
        ],
      },
    });

    const [, data3] = await verify3.check({
      list: [1, 2, 3],
    });

    expect(data3).toEqual({
      list: [1, 3],
    });
  });
});
