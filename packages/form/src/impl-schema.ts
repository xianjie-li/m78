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
  isTruthyOrZero,
  NameItem,
  NamePath,
  setNamePathValue,
} from "@m78/utils";
import { isRootName } from "./common.js";

export function _implSchema(ctx: _Context) {
  const { instance } = ctx;

  instance.getSchemas = () => {
    const [schemas, invalidNames] = ctx.getFormatterSchemas();

    return {
      schemas,
      invalidNames,
    };
  };

  instance.getSchema = (name, opt = {}) => {
    const [schema] = ctx.getFormatterSchema(
      name,
      opt.skipChildren,
      opt.withoutProcess
    );
    return schema;
  };

  instance.setSchemas = (schema) => {
    ctx.schema = isArray(schema) ? { schemas: schema } : schema;

    if (!ctx.verifyOnly && !ctx.lockNotify) {
      instance.events.update.emit();
    }
  };

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

  ctx.getFormatterSchema = (name, skipChildren = true, withoutProcess) => {
    // 所有invalid项的name
    const invalidNames: NamePath[] = [];

    let sc: FormSchema | FormSchemaWithoutName | undefined = undefined;
    let parentNames: NameItem[] = [];

    const isRoot = isRootName(name);

    if (isRoot) {
      sc = {
        ...ctx.schema,
        name: "[]",
      };
    } else {
      const arrName = ensureArray(name).slice();

      if (!arrName.length) return [null, invalidNames];

      recursionGetSchema(ctx.schema, arrName);

      if (sc === undefined) return [null, invalidNames];

      // 当前名称
      const curName = arrName.pop();

      parentNames = arrName;

      // 为eachSchema等子项设置名称
      if (!("name" in sc)) setNamePathValue(sc, "name", curName);
    }

    // 递归获取指定schema
    function recursionGetSchema(
      schema: FormSchema | FormSchemaWithoutName,
      na: NameItem[]
    ) {
      // 长度用尽, 完成匹配
      if (!na.length) {
        sc = Object.assign({}, schema);
        return;
      }

      // 从schema子项查找
      if (schema.schemas?.length) {
        for (const sc of schema.schemas) {
          // 子项是否有匹配的, 有则继续向下查找
          if (sc.name === na[0]) {
            recursionGetSchema(sc, na.slice(1));
            return;
          }
        }
      }

      // 从eachSchema子项查找
      if (schema.eachSchema) {
        recursionGetSchema(schema.eachSchema, na.slice(1));
        return;
      }

      // 无匹配
    }

    if (withoutProcess) return [sc, invalidNames];

    const processed = recursionHandleSchemas({
      schema: sc!,
      parentNames,
      invalidCB(n) {
        invalidNames.push(n);
      },
      returnInvalid: true,
      skipChildren,
      isRoot,
    }) as FormSchema | undefined;

    return [processed || null, invalidNames];
  };

  ctx.schemaSpecialPropsHandle = (
    schema: FormSchemaWithoutName | FormSchema,
    namePath,
    skipEachSchema
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
    // schema.valid 为 false 或主动不处理时跳过
    if (!skipEachSchema && schema.valid !== false && !isEmpty(eachSchema)) {
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
    /** 根schema */
    isRoot?: boolean;
    /** 默认该项valid为false时返回void, 设置为true时返回项 */
    returnInvalid?: boolean;
    /** 设置为true时, 不处理eachSchema/schema等子项 */
    skipChildren?: boolean;
  }) {
    const {
      schema,
      parentNames,
      invalidCB,
      isRoot = false,
      returnInvalid,
      skipChildren,
    } = args;

    // 复制
    const combine: FormSchema | FormSchemaWithoutName = Object.assign(
      {},
      schema
    );

    const hasName = "name" in combine;

    const names = ensureArray(parentNames).slice();

    if (!isRoot) {
      // 非根选项且不包含name的项忽略
      // 无name的情况:
      // - eachSchema 项经过处理前不会直接传入当前函数
      if (!hasName) return;
      // 添加当前name
      else names.push((combine as FormSchema).name);
    }

    // 处理dynamic / eachSchema 等
    ctx.schemaSpecialPropsHandle(combine, names, skipChildren);

    // 无效schema的子级视为无效, 不再做处理
    if (combine.valid === false) {
      invalidCB?.(names);
      return returnInvalid ? combine : undefined;
    }

    // 包含schema子项时, 对子项进行相同的处理
    if (!skipChildren && combine.schemas && combine.schemas.length) {
      combine.schemas = combine.schemas
        .map((s: FormSchema) =>
          recursionHandleSchemas({
            schema: s,
            parentNames: names,
            invalidCB,
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
