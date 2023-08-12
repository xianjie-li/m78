import { _Context, FormSchema, FormSchemaWithoutName } from "./types.js";
import {
  ensureArray,
  isArray,
  isFunction,
  isObject,
  NameItem,
  NamePath,
} from "@m78/utils";
import { _ANY_NAME_PLACE_HOLD } from "./common.js";

export function _implSchema(ctx: _Context) {
  const { instance } = ctx;

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

  instance.getSchemas = () => {
    const [schemas] = ctx.getFormatterSchemas();
    return schemas;
  };

  instance.getSchema = (name) => {
    let sc: FormSchema | FormSchemaWithoutName | null = null;

    function recursionGetSchema(
      schema: FormSchema | FormSchemaWithoutName,
      name: NameItem[]
    ) {
      if (!name.length) {
        sc = { ...schema };
        return;
      }

      if (schema.schema?.length) {
        for (const sc of schema.schema) {
          if (sc.name === name[0]) {
            recursionGetSchema(sc, name.slice(1));
            return;
          }
        }
      }

      if (schema.eachSchema) {
        recursionGetSchema(schema.eachSchema, name.slice(1));
        return;
      }
    }

    recursionGetSchema(ctx.schema, ensureArray(name));

    if (sc) {
      schemaBaseClone(sc);
    }

    return sc;
  };

  instance.setSchemas = (schema) => {
    ctx.schema = schema;

    if (!ctx.lockNotify) {
      instance.events.update.emit();
    }

    instance.verify().catch(() => {});
  };

  /** 对Schema上的dynamic进行处理, 并克隆validator */
  function schemaBaseClone(schema: FormSchemaWithoutName | FormSchema) {
    if (isFunction(schema.dynamic)) {
      const dProps = schema.dynamic(instance);
      if (isObject(dProps)) Object.assign(schema, dProps);
    }

    // 在这这里对一些可能会被以外更改的引用值进行手动克隆
    if (schema.validator) {
      schema.validator = [...ensureArray(schema.validator)];
    }
  }

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

    let hasName = "name" in combine;

    if (isArray(combine.eachSchema) && hasName) {
      // @ts-ignore
      delete combine.name;
      hasName = false;
    }

    const names = [...ensureArray(parentNames)];

    schemaBaseClone(combine);

    if (!isRoot) {
      if (hasName) {
        names.push((combine as any).name);
      } else {
        names.push(_ANY_NAME_PLACE_HOLD);
      }
    }

    // let extraValid: undefined | boolean;

    // if (isFunction(config.extraValidGetter)) {
    //   const extra = config.extraValidGetter(combine);
    //   if (isBoolean(extra) && !extra) {
    //     extraValid = false;
    //   }
    // }

    if (hasName && combine.valid === false) {
      invalidCB(names);
    }

    // 无效schema的子级视为无效
    if (combine.valid === false) {
      return;
    }

    if (combine.schema) {
      combine.schema = combine.schema
        .map((s: FormSchema) => {
          return recursionHandleSchemas({
            schema: s,
            parentNames: names,
            invalidCB,
          });
        })
        .filter((i) => !!i) as FormSchema[];

      if (!combine.schema.length) {
        delete combine.schema;
      }
    }

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
