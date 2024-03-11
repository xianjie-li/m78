import {
  _Context,
  FormSchema,
  FormSchemaWithoutName,
  FormVerifyInstance,
} from "./types.js";
import {
  ensureArray,
  getNamePathValue,
  isArray,
  isEmpty,
  isFunction,
  isObject,
  NameItem,
  NamePath,
  stringifyNamePath,
} from "@m78/utils";

export function _implSchema(ctx: _Context) {
  const { instance } = ctx;

  instance.getSchemas = () => {
    if (ctx.cacheSchema) return ctx.cacheSchema;

    // 所有invalid项的name
    const invalidNames: NamePath[] = [];
    const schemasFlat = new Map<string, FormSchema>();

    const ret = {
      schemas: {},
      invalidNames,
      schemasFlat,
    };

    // 提前设置, 部分场景会需要在dynamic中提前访问缓存
    ctx.cacheSchema = ret;

    ret.schemas = recursionHandleSchemas({
      schema: ctx.schema,
      parentNames: [],
      invalidCB: (name) => invalidNames.push(name),
      eachCB: (name, sc) => {
        const sName = stringifyNamePath(name);

        schemasFlat.set(sName, sc);
      },
      isRoot: true,
    });

    return ret;
  };

  instance.getSchema = (name) => {
    const { schemasFlat } = instance.getSchemas();

    return schemasFlat.get(stringifyNamePath(name)) || null;
  };

  instance.setSchemas = (schema) => {
    ctx.schema = isArray(schema) ? { schemas: schema } : schema;

    ctx.cacheSchema = null;

    if (!ctx.verifyOnly && !ctx.lockNotify) {
      instance.events.update.emit();
    }
  };

  /**
   * 对Schema上的dynamic/eachSchema/validator进行处理, namePath为当前schema的name, skipEachSchema为true时, 不处理eachSchema
   *
   * 处理流程:
   * - 处理当前 schema 的 dynamic 选项, 并用 dynamic 返回的选项合并到当前schema
   * - 处理eachSchema, 根据当前对应值的类型(数组/对象)为当前schema生成schema子配置
   * - 克隆validator, 并确保其为一个数组
   *
   * 该方法直接对原对象进行读写, 处理后的schema不再包含dynamic/eachSchema配置
   * */
  const schemaSpecialPropsHandle = (
    schema: FormSchemaWithoutName | FormSchema,
    namePath: NameItem[],
    skipEachSchema?: boolean
  ) => {
    // # 处理dynamic, 若包含eachSchema处理则跳过, 应交于生成后的.schema处理
    if (isFunction(schema.dynamic)) {
      const dProps = schema.dynamic({
        form: instance as any as FormVerifyInstance,
        namePath,
      });

      if (isObject(dProps)) Object.assign(schema, dProps);
    }

    const eachSchema = schema.eachSchema;

    // # 处理eachSchema
    // 通过当前值遍历生成 schema list
    if (!skipEachSchema && !isEmpty(eachSchema)) {
      const curValue = getNamePathValue(ctx.values, namePath);

      // 作为数组且有对应项时
      if (isArray(curValue) && curValue.length) {
        schema.schemas = curValue.map((i, ind) => {
          return Object.assign(
            {
              name: ind,
            },
            eachSchema
          );
        });
      }

      // 作为对象且不为空对象时
      if (isObject(curValue) && !isEmpty(curValue)) {
        schema.schemas = Object.keys(curValue).map((key) => {
          return Object.assign(
            {
              name: key,
            },
            eachSchema
          );
        });
      }
    }

    // 在这这里对一些可能会被意外更改的引用值进行手动克隆,
    if (schema.validator) {
      schema.validator = [...ensureArray(schema.validator)];
    }

    // 清理特殊处理后的项
    delete schema.dynamic;
    delete schema.eachSchema;
  };

  /** 递归一个schema, 处理其所有项的dynamic/eachSchema/invalid/list并对每一项进行拷贝 */
  function recursionHandleSchemas(args: {
    /** 当前schema */
    schema: FormSchemaWithoutName | FormSchema;
    /** 传入父级的name */
    parentNames: NamePath;
    /** 对invalid的项进行回调 */
    invalidCB?: (name: NamePath) => void;
    /** 对递归到的每一项进行回调, 不包含根schema */
    eachCB?: (name: NamePath, schema: FormSchema) => void;
    /** 根schema */
    isRoot?: boolean;
    /** 设置为true时, 不处理eachSchema/schema等子项 */
    skipChildren?: boolean;
  }) {
    const {
      schema,
      parentNames,
      invalidCB,
      eachCB,
      isRoot = false,
      skipChildren,
    } = args;

    // 复制
    const combine = Object.assign({}, schema);

    const hasName = "name" in combine;

    const names = ensureArray(parentNames).slice();

    if (!isRoot) {
      // 非根选项且不包含name的项忽略
      // 无name的情况:
      // - eachSchema 项经过处理前不会直接传入当前函数, 可直接忽略
      if (!hasName) return combine;
      // 添加当前name
      else names.push((combine as FormSchema).name);
    }

    // 处理dynamic / eachSchema 等
    schemaSpecialPropsHandle(combine, names, skipChildren);

    // 对处理后的combine执行 eachCB
    if (!isRoot) eachCB?.(names, combine as FormSchema);

    if (combine.valid === false) {
      invalidCB?.(names);
      //  return returnInvalid ? combine : undefined; // update: 添加schema缓存机制后, 不再跳过invalid项的子项
    }

    // 包含schema子项时, 对子项进行相同的处理
    if (!skipChildren && combine.schemas && combine.schemas.length) {
      combine.schemas = combine.schemas
        .map((s: FormSchema) =>
          recursionHandleSchemas({
            schema: s,
            parentNames: names,
            invalidCB,
            eachCB,
          })
        )
        .filter((i) => !!i) as FormSchema[];

      // 处理后无有效选项时直接移除
      if (!combine.schemas.length) {
        delete combine.schemas;
      }
    }

    return combine;
  }
}
