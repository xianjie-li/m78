import { Meta, Validator } from "../types";
import { array } from "./array";

export enum ListValidatorType {
  contain = "contain",
  equal = "equal",
}

interface ListValidatorOpt {
  /** 两个列表的覆盖类型, contain - 包含  equal - 完全相等  */
  type: ListValidatorType;
  /** 如果项是对象等特殊类型, 可以通过此项提取对应的值, 如:  item => item.id, 不影响list中的选项 */
  collector?: (item: any) => any;
  /** 用于对比的项 */
  list: any[];
}

export const listValidatorKey = "verifyList";

/**
 * 检测两个集合的覆盖类型, 比如数组值是否包含另list中的所有项, 是否与list完全相等
 * */
export function list(opt: ListValidatorOpt) {
  const listValidator: Validator = (meta: Meta) => {
    const tpl = meta.config.languagePack.list;

    const e = array()(meta);

    if (e) return e;

    const ls = opt.collector ? meta.value.map(opt.collector) : meta.value;

    const miss = opt.list.filter((i: any) => ls.indexOf(i) === -1);

    if (opt.type === ListValidatorType.contain) {
      if (miss.length) {
        return {
          errorTemplate: tpl.miss,
          interpolateValues: {
            miss,
          },
        };
      }
    }

    if (opt.type === ListValidatorType.equal) {
      if (ls.length !== opt.list.length) {
        return tpl.diffLength;
      }

      // 长度相等的情况下, 只会少于不会多于
      if (miss.length) {
        return {
          errorTemplate: tpl.miss,
          interpolateValues: {
            miss,
          },
        };
      }
    }
  };

  listValidator.key = listValidatorKey;

  return listValidator;
}
