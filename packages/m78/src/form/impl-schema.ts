import { _Context, FormSchema, FormSchemaWithoutName } from "./types.js";
import {
  ensureArray,
  isArray,
  isFunction,
  NameItem,
  NamePath,
} from "@m78/utils";
import { ANY_NAME_PLACE_HOLD } from "./common.js";

export function _implSchema(ctx: _Context) {
  const { instance } = ctx;

  ctx.getSchemasAndInvalid = () => {
    const names: NamePath[] = [];
    const schemas = recursionHandleSchemas(
      ctx.schema,
      [],
      (name) => names.push(name),
      true
    );
    return [schemas!, names];
  };

  instance.getSchemas = () => {
    const [schemas] = ctx.getSchemasAndInvalid();
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

    instance.verify();
  };

  /** 对Schema上的dynamic进行处理, 并克隆validator */
  function schemaBaseClone(schema: FormSchemaWithoutName | FormSchema) {
    if (isFunction(schema.dynamic)) {
      const dProps = schema.dynamic(instance);
      // @ts-ignore
      delete dProps["dynamic"];
      Object.assign(schema, dProps);
    }

    // 在这这里对一些可能会被以外更改的引用值进行手动克隆
    if (schema.validator) {
      schema.validator = [...ensureArray(schema.validator)];
    }
  }

  /** 递归一个schema, 处理其所有项的dynamic并对每一项进行拷贝 */
  function recursionHandleSchemas(
    schema: FormSchemaWithoutName | FormSchema,
    parentNames: NamePath,
    invalidCB: (name: NamePath) => void,
    isRoot = false
  ) {
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
        names.push(ANY_NAME_PLACE_HOLD);
      }
    }

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
          return recursionHandleSchemas(s, names, invalidCB);
        })
        .filter((i) => !!i) as FormSchema[];

      if (!combine.schema.length) {
        delete combine.schema;
      }
    }

    if (combine.eachSchema) {
      combine.eachSchema = recursionHandleSchemas(
        combine.eachSchema,
        names,
        invalidCB
      );

      if (!combine.eachSchema) {
        delete combine.eachSchema;
      }
    }

    return combine;
  }
}
