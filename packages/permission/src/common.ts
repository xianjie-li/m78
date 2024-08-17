import { isArray, isEmpty, isString } from "@lxjx/utils";
import {
  Permission,
  PermissionConfig,
  PermissionKeys,
  CreatePermissionConfig,
  Validator,
  Validators,
  ValidMeta,
} from "./types.js";
import {
  _PermissionProSeedState,
  _PermissionProAST,
  PermissionProMeta,
  PermissionProMetaConfig,
  _PermissionProPiece,
  _PermissionProPieceType,
  PermissionProTpl,
  PermissionProRejectMeta,
} from "./proType.js";

export const throwError = (str: string): never => {
  throw Error(`PermissionPro: ${str}`);
};

/**
 * 传入验证key、验证器列表、依赖数据、额外数据。对该key进行验证后返回验证结果(void 或 ValidMeta)
 * */
export const validItem = (
  key: string,
  validators: Validators<any>,
  state: any,
  extra: any
) => {
  const validator = validators[key];
  // 不存在此验证器
  if (!validator) return;

  return validator(state, extra);
};

/**
 * 实现Permission api
 * */
export function permissionImpl(conf: CreatePermissionConfig): Permission {
  const permission = (keys: PermissionKeys<any>, config?: PermissionConfig) => {
    const { validators, validFirst, seed } = conf;
    const state = seed.get();
    const { extra, validators: localValidators }: PermissionConfig =
      config || {};

    /** 所有验证失败结果 */
    const rejects: ValidMeta[] = [];
    /** 是否通过 */
    let pass = true;

    /**
     * 传入单个权限key或key数组进行验证, 并将验证结果写入pass和rejects
     * 单个验证时: 验证该项并返回验证meta信息，验证正确时无返回
     * key数组时: 作为条件`or`进行验证，只要其中任意一项通过了验证则通过验证
     * */
    const test = (key: any, isOr?: boolean) => {
      if (isArray(key)) {
        const tempRejects: ValidMeta[] = [];
        let flag = false;

        for (const pItem of key) {
          const meta = test(pItem, true);

          if (meta) {
            tempRejects.push(meta);
          }

          // 成功任意一项即视为成功
          if (!meta) {
            flag = true;
            break;
          }
        }

        if (!flag) {
          pass = false;
          validFirst
            ? rejects.push(tempRejects[0])
            : rejects.push(...tempRejects);
        }
      } else {
        const meta = validItem(
          key,
          { ...validators, ...localValidators },
          state,
          extra
        );

        if (!meta) return;

        // 非or时直接判定为失败
        if (!isOr) {
          pass = false;
          rejects.push(meta);
        }

        return meta;
      }
    };

    if (validFirst) {
      for (const pItem of keys) {
        if (pass) {
          test(pItem);
        }
      }
    } else {
      keys.forEach((ak) => test(ak));
    }

    return rejects.length ? rejects : null;
  };

  permission.seed = conf.seed;

  return permission;
}

/**
 * ###############################################
 *                      Pro
 * ###############################################
 * */

/**
 * 将PermissionTpl转换为PermissionProAST, 如果格式错误则抛出异常
 * 首尾为特殊字符时异常
 * */
export function permissionProTplParser(tpl: PermissionProTpl) {
  const invalidTip = `invalid permission template -> ${tpl}`;
  const keyReg = /\w+|&|\||\(|\)/g;

  if (!tpl || !isString(tpl)) throwError(invalidTip);

  const [mod, keys] = tpl.split(":");

  if (!mod || !keys) throwError(invalidTip);

  const ast: _PermissionProAST = [];

  let match: RegExpExecArray | null = null;
  let bracketsFlag = false;
  let lastType: _PermissionProPieceType | null = null;

  // eslint-disable-next-line no-cond-assign
  while ((match = keyReg.exec(keys)) !== null) {
    const s = match[0];

    const ls = bracketsFlag
      ? (ast[ast.length - 1] as Array<_PermissionProPiece>)
      : ast;

    switch (s) {
      case "&":
        ls.push({
          type: _PermissionProPieceType.and,
        });
        lastType = _PermissionProPieceType.and;
        break;
      case "|":
        ls.push({
          type: _PermissionProPieceType.or,
        });
        lastType = _PermissionProPieceType.or;
        break;
      case "(":
        if (!isArray(ls) || bracketsFlag) throwError(invalidTip);

        ls.push([]);
        bracketsFlag = true;
        lastType = _PermissionProPieceType.leftBrackets;
        break;
      case ")":
        bracketsFlag = false;
        lastType = _PermissionProPieceType.rightBrackets;
        break;
      default:
        if (lastType === _PermissionProPieceType.rightBrackets)
          throwError(invalidTip);

        ls.push({
          type: _PermissionProPieceType.key,
          key: s,
        });
        lastType = _PermissionProPieceType.key;
    }
  }

  if (!ast.length) throwError(invalidTip);

  return [mod, ast] as const;
}

/** 权限实现的主验证器key */
export const PERMISSION_PRO_NAME = "PERMISSION_PRO";

/**
 * PermissionPro内置验证器
 * */
export function permissionProValidatorGetter(/* 以后可能会接收配置 */) {
  const validator: Validator<_PermissionProSeedState> = (
    { permission, meta },
    keys: Array<PermissionProTpl | PermissionProTpl[]>
  ): any /* pro需要改写验证返回 */ => {
    // 没有传入要验证的权限
    if (!isArray(keys) || !keys.length) return null;

    const rejects: PermissionProMeta[] = [];

    const checkItem = (k: string) => {
      const [mod, ast] = permissionProTplParser(k);
      return checkAST(ast, permission, mod, true, meta);
    };

    const pushEject = (arg: ReturnType<typeof checkItem>) => {
      if (!arg.pass) {
        rejects.push(...arg.result.filter((item: any) => !item.pass));
      }
    };

    keys.forEach((item) => {
      if (isArray(item)) {
        const temp: ReturnType<typeof checkItem>[] = [];
        let passFlag = false;

        for (const string of item) {
          const res = checkItem(string);
          if (res.pass) {
            passFlag = true;
          } else {
            temp.push(res);
          }
        }

        !passFlag && temp.forEach(pushEject);
      } else {
        pushEject(checkItem(item));
      }
    });

    if (!rejects.length) return null;

    const rejectMeta: NonNullable<PermissionProRejectMeta> = [];

    rejects.forEach((item) => {
      const current: PermissionProMeta = meta?.each
        ? meta.each(item.result)
        : item.result;

      const modKey = current.__mod;
      const moduleMeta = meta?.modules || {};
      const currentMod = moduleMeta[modKey];
      let label = modKey;

      if (!isArray(currentMod) && currentMod?.label) {
        label = currentMod.label;
      }

      const currentRejectMeta = rejectMeta.find((it) => it.module === modKey);

      if (!currentRejectMeta) {
        rejectMeta.push({
          label,
          module: modKey,
          missing: [current],
        });
      } else {
        currentRejectMeta.missing.push(current);
      }

      delete current.__mod;
    });

    return rejectMeta;
  };

  return validator;
}

/** 对一个PermissionProAST执行验证 */
export function checkAST(
  ast: _PermissionProAST,
  permission: _PermissionProSeedState["permission"],
  mod: string,
  isFirst: boolean,
  meta?: PermissionProMetaConfig
) {
  const result: any[] = [];
  let pass = false;

  let lastCondition: _PermissionProPieceType | null = null;
  let lastPass: boolean | undefined;

  for (const piece of ast) {
    let res: any = null;

    if (isArray(piece)) {
      res = checkAST(piece, permission, mod, false, meta);
    } else if (piece.type === _PermissionProPieceType.key) {
      res = checkKeyPiece(piece, permission, mod, meta);
    }

    // 前一项为 & 和 | 时, 对比前后结果设置pass
    if (
      res &&
      (lastCondition === _PermissionProPieceType.and ||
        lastCondition === _PermissionProPieceType.or)
    ) {
      if (lastPass === undefined) {
        lastPass = result[result.length - 1].pass;
      }

      if (lastCondition === _PermissionProPieceType.and) {
        pass = res.pass && lastPass;
        lastPass = pass;
      }

      if (lastCondition === _PermissionProPieceType.or) {
        pass = res.pass || lastPass;
        lastPass = pass;
      }
    }

    if (res) result.push(res);

    // 当前项为 & 和 | 时标记
    if (
      !isArray(piece) &&
      (piece.type === _PermissionProPieceType.and ||
        piece.type === _PermissionProPieceType.or)
    ) {
      lastCondition = piece.type;
    }

    // 不是则还原
    if (res) {
      lastCondition = null;
    }
  }

  if (isFirst) {
    const res = result.reduce((prev, item) => {
      if (isArray(item.result)) {
        prev.push(...item.result);
      } else {
        prev.push(item);
      }

      return prev;
    }, []);

    return {
      // 只有一项上面代码不会走到pass的流程, 直接使用该项的pass
      pass: res.length === 1 ? res[0].pass : pass,
      result: res,
    };
  }

  return {
    pass,
    result,
  };
}

/** 根据权限对单个key类型的PermissionProPiece进行检查 */
function checkKeyPiece(
  piece: _PermissionProPiece,
  permission: _PermissionProSeedState["permission"],
  mod: string,
  meta?: PermissionProMetaConfig
) {
  const permissions = permission[mod];

  const result = getMeta(mod, piece.key!, meta);

  if (!isArray(permissions) || !permissions.length)
    return { pass: false, result };

  const pass = permissions.includes(piece.key!);

  return {
    pass,
    result,
  };
}

/** 根据key从指定meta配置中拿到其对应的meta信息, 没有则根据key和mod生成回退meta */
function getMeta(
  mod: string,
  key: string,
  meta?: PermissionProMetaConfig
): PermissionProMeta {
  const defaultMeta = {
    label: key,
    key,
    __mod: mod,
  };

  if (!meta || (!meta.general?.length && isEmpty(meta.modules)))
    return defaultMeta;

  if (!isEmpty(meta.modules)) {
    const currentMeta = meta.modules![mod];

    const list = isArray(currentMeta) ? currentMeta : currentMeta?.list;

    if (list?.length) {
      const c = list.find((item) => item.key === key);

      if (c) return { ...c, __mod: mod };
    }
  }

  if (meta.general?.length) {
    const c = meta.general.find((item) => item.key === key);

    if (c) return { ...c, __mod: mod };
  }

  return defaultMeta;
}
