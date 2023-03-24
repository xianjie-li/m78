import {
  array,
  number,
  object,
  required,
  string,
  VerifyError,
} from "@m78/verify/index.js";
import { jest } from "@jest/globals";
import { createForm } from "./index.js";

describe("form-vanilla", () => {
  test("root single value test", async () => {
    const form = createForm({
      defaultValue: 1,
      schemas: {
        validator: [required(), string()],
      },
    });

    try {
      await form.verify();
    } catch (e) {
      if (e instanceof VerifyError) {
        expect(e.rejects.map((i: any) => i.message)).toEqual([
          "Must be a string",
        ]);
      }
    }
  });

  test("root array test", async () => {
    const form = createForm({
      defaultValue: [1, 2, 3, "4"],
      schemas: {
        eachSchema: {
          validator: [required(), number()],
        },
      },
    });

    try {
      await form.verify();
    } catch (e) {
      if (e instanceof VerifyError) {
        expect(e.rejects.map((i: any) => i.message)).toEqual([
          "Must be a number",
        ]);
      }
    }
  });

  test("all round test", async () => {
    const form = createForm({
      autoVerify: false,
      defaultValue: {
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
        schema: [
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
              schema: [
                {
                  name: "title",
                },
              ],
            },
          },
          {
            name: "nestDeepField1",
            schema: [
              {
                name: "nestDeepField1_1",
                schema: [
                  {
                    name: "nestDeepField1_1_1",
                    schema: [
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
    expect(form.getFormChanged()).toBe(true);

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

    try {
      await form.verify();
    } catch (e: any) {
      if (e instanceof VerifyError) {
        expect(e.rejects.map((i: any) => `${i.name}:${i.message}`)).toEqual([
          "nestArrayFiled1:Required",
          "nestDeepField1.nestDeepField1_1.nestDeepField1_1_1.title:Required",
        ]);
      }
    }

    expect(updateCB.mock.calls.length).toBe(12);
    expect(changeCB.mock.calls.length).toBe(10);

    form.setValue("nestArrayFiled1", [1, 2, 3]);

    expect(updateCB.mock.calls.length).toBe(13);
    expect(changeCB.mock.calls.length).toBe(11);

    try {
      await form.verify("nestArrayFiled1");
    } catch (e: any) {
      if (e instanceof VerifyError) {
        expect(e.rejects.map((i: any) => `${i.name}:${i.message}`)).toEqual([
          "nestArrayFiled1:No less than 4 items",
        ]);
      }
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
      schema: [
        {
          name: "nestArrayFiled1",
          validator: [required(), object()],
        },
      ],
    });

    try {
      await form.submit();
    } catch (e: any) {
      if (e instanceof VerifyError) {
        expect(e.rejects.map((i: any) => `${i.name}:${i.message}`)).toEqual([
          "nestArrayFiled1:Must be a regular object",
        ]);
      }
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
      defaultValue: {
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
        schema: [
          {
            name: "field2",
            dynamic: (form) => {
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
            dynamic: (form) => ({
              valid: form.getValue("field1") !== "abcd",
              schema:
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

    try {
      await form.verify();
    } catch (e: any) {
      if (e instanceof VerifyError) {
        expect(e.rejects.map((i: any) => `${i.name}:${i.message}`)).toEqual([
          "field2:No less than 4 items",
        ]);
      }
    }

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

    try {
      await form.verify();
    } catch (e: any) {
      if (e instanceof VerifyError) {
        expect(e.rejects.map((i: any) => `${i.name}:${i.message}`)).toEqual([
          "field2:Must be a regular object",
        ]);
      }
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
      defaultValue: {
        noList: "abc",
        list1: [1, 2, 3],
        list2: [
          {
            title: "1",
          },
        ],
      },
      schemas: {
        schema: [
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
      defaultValue: [1, 2, 3],
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
      defaultValue: {
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
        schema: [
          {
            name: "list",
            list: true,
            eachSchema: {
              schema: [
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
      defaultValue: {
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
