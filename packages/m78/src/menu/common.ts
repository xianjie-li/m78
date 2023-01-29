import { _FlatMap, MenuOption } from "./types.js";
import {
  DataSourceItemCustom,
  getChildrenByDataSource,
  getValueByDataSource,
  ValueType,
} from "../common/index.js";

/** 获取树列表及其所有子项的value */
export function _getOptionAllValues(
  options: MenuOption[],
  cus?: DataSourceItemCustom
) {
  const res: ValueType[] = [];
  options.forEach((item) => {
    const val = getValueByDataSource(item, cus);
    if (val !== null) {
      res.push(val!);
    }

    const children = getChildrenByDataSource(item, cus);

    if (children.length) {
      res.push(..._getOptionAllValues(children, cus));
    }
  });
  return res;
}

/**
 * 铺平选项并生成易于查询的结构
 * */
export function _flatOptions(
  options: MenuOption[],
  cus?: DataSourceItemCustom
) {
  const map: _FlatMap = {};

  const getNextValid = (list: MenuOption[], ind: number) => {
    for (let i = ind; i < list.length; i++) {
      const cur = list[i];
      const val = getValueByDataSource(cur, cus);
      if (val !== null && !cur.disabled) return cur;
    }
  };

  const getPrevValid = (list: MenuOption[], ind: number) => {
    for (let i = ind; i >= 0; i--) {
      const cur = list[i];
      const val = getValueByDataSource(cur, cus);
      if (val !== null && !cur.disabled) return cur;
    }
  };

  function flat(list: MenuOption[], parent?: MenuOption) {
    list.forEach((i, ind) => {
      const value = getValueByDataSource(i)!;

      map[value] = {
        parent,
        child: i.children?.[0],
        next: getNextValid(list, ind + 1) || getNextValid(list, 0),
        prev:
          getPrevValid(list, ind - 1) || getPrevValid(list, list.length - 1),
        siblings: list,
        value,
        option: i,
      };

      if (i.children?.length) {
        flat(i.children, i);
      }
    });
  }

  flat(options);

  return map;
}
