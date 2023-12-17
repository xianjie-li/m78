import { _Context, FormSchema, FormSchemaWithoutName } from "./types.js";
import {
  ensureArray,
  isFunction,
  isObject,
  NameItem,
  NamePath,
} from "@m78/utils";
import { _ANY_NAME_PLACE_HOLD } from "./common.js";

export function _implSchema(ctx: _Context) {
  const { instance } = ctx;

  instance.getSchemas = () => {
    const [schemas] = ctx.getFormatterSchemas();
    return schemas;
  };

  instance.getSchema = (name) => {
    let sc: FormSchema | FormSchemaWithoutName | null = null;

    // 递归获取指定schema
    function recursionGetSchema(
      schema: FormSchema | FormSchemaWithoutName,
      name: NameItem[]
    ) {
      // 完成匹配
      if (!name.length) {
        sc = Object.assign({}, schema);
        return;
      }

      if (schema.schema?.length) {
        for (const sc of schema.schema) {
          // 子项是否有匹配的, 有则继续向下查找
          if (sc.name === name[0]) {
            recursionGetSchema(sc, name.slice(1));
            return;
          }
        }
      }

      // eachSchema 直接跳过当前级向下一级匹配
      if (schema.eachSchema) {
        recursionGetSchema(schema.eachSchema, name.slice(1));
        return;
      }
    }

    recursionGetSchema(ctx.schema, ensureArray(name));

    if (sc) {
      ctx.schemaBaseHandleAndClone(sc);
    }

    return sc;
  };

  if (!ctx.verifyOnly) {
    instance.setSchemas = (schema) => {
      ctx.schema = schema;

      if (!ctx.lockNotify) {
        instance.events.update.emit();
      }
    };
  }

  ctx.getFormatterSchemas = () => {
    // 所有invalid项的name
    const invalidNames: NamePath[] = [];

    const schemas = recursionHandleSchemas({
      schema: ctx.schema,
      parentNames: [],
      invalidCB: (name) => invalidNames.push(name),
      isRoot: true,
    });

    return [schemas!, invalidNames];
  };

  ctx.schemaBaseHandleAndClone = (
    schema: FormSchemaWithoutName | FormSchema
  ) => {
    if (isFunction(schema.dynamic)) {
      const dProps = schema.dynamic(instance);
      if (isObject(dProps)) Object.assign(schema, dProps);
    }

    // 在这这里对一些可能会被意外更改的引用值进行手动克隆
    if (schema.validator) {
      schema.validator = [...ensureArray(schema.validator)];
    }
  };

  /** 递归一个schema, 处理其所有项的dynamic/invalid/list并对每一项进行拷贝 */
  function recursionHandleSchemas(args: {
    /** 当前schema */
    schema: FormSchemaWithoutName | FormSchema;
    /** 传入父级的name */
    parentNames: NamePath;
    /** 对invalid的项进行回调 */
    invalidCB: (name: NamePath) => void;
    /** 根schema */
    isRoot?: boolean;
  }) {
    const { schema, parentNames, invalidCB, isRoot = false } = args;

    const combine: FormSchema | FormSchemaWithoutName = Object.assign(
      {},
      schema
    );

    const hasName = "name" in combine;

    const names = [...ensureArray(parentNames)];

    ctx.schemaBaseHandleAndClone(combine);

    if (!isRoot) {
      if (hasName) {
        names.push((combine as FormSchema).name);
      } else {
        names.push(_ANY_NAME_PLACE_HOLD);
      }
    }

    if (hasName && combine.valid === false) {
      invalidCB(names);
    }

    // 无效schema的子级视为无效
    if (combine.valid === false) {
      return;
    }

    // 包含schema子项时, 对子项进行相同的处理
    if (combine.schema) {
      combine.schema = combine.schema
        .map((s: FormSchema) =>
          recursionHandleSchemas({
            schema: s,
            parentNames: names,
            invalidCB,
          })
        )
        .filter((i) => !!i) as FormSchema[];

      if (!combine.schema.length) {
        delete combine.schema;
      }
    }

    // 包含eachSchema子项时, 对子项进行相同的处理
    if (combine.eachSchema) {
      combine.eachSchema = recursionHandleSchemas({
        schema: combine.eachSchema,
        parentNames: names,
        invalidCB,
      });

      if (!combine.eachSchema) {
        delete combine.eachSchema;
      }
    }

    return combine;
  }
}