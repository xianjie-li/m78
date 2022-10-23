import {
  FormLikeWithExtra,
  useFn,
  useFormState,
  useSelf,
  UseFormStateConfig,
} from "../../";
import { isArray } from "@m78/utils";
import _difference from "lodash/difference";
import { useMemo } from "react";

export interface UseCheckConf<T, OPTION>
  extends FormLikeWithExtra<T[], OPTION[]>,
    UseFormStateConfig {
  /** 选项数组 */
  options?: OPTION[];
  /** 所有禁用值 */
  disables?: T[];
  /** 当option子项为对象类型时，传入此项来决定从该对象中取何值作为实际的选项值  */
  collector?: (item: OPTION) => T;
  /** 如果当前value包含在options中不存在的值，会触发此函数，用于从服务器或其他地方拉取不存在的选项 */
  notExistValueTrigger?(val: T[]): void;
}

/** checked可以允许存在options中不存在的值， 所有选中, 局部选中都只针对传入选项中存在的值来确定 */
export interface UseCheckReturns<T, OPTION> {
  /** 部分值被选中(只针对存在于options中的选项) */
  partialChecked: boolean;
  /** 是否全部选中(只针对存在于options中的选项) */
  allChecked: boolean;
  /** 没有任何值被选中 */

  noneChecked: boolean;
  /** 被选中值, 存在collector时所有check项都会先走collector */
  checked: T[];
  /** 被选中的原始值，不走collector，未传collector时与check表现一致 */
  originalChecked: OPTION[];
  /** 检测值是否被选中 */
  isChecked: (val: T) => boolean;
  /** 检测值是否被禁用 */
  isDisabled: (val: T) => boolean;
  /** 选中传入的值 */
  check: (val: T) => void;
  /** 取消选中传入的值 */
  unCheck: (val: T) => void;
  /** 选择全部值 */
  checkAll: () => void;
  /** 取消选中所有值 */
  unCheckAll: () => void;
  /** 反选, 返回反选后的值 */
  toggle: (val: T) => boolean | undefined;
  /** 反选所有值 */
  toggleAll: () => void;
  /** 一次性设置所有选中的值, 不影响禁用项 */
  setChecked: (nextChecked: T[]) => void;
  /** 指定值并设置其选中状态 */
  setCheckBy: (val: T, isChecked: boolean) => void;
  /** 以列表的形式添加选中项 */
  checkList: (checkList: T[]) => void;
  /** 以列表的形式移除选中项 */
  unCheckList: (checkList: T[]) => void;
}

export function useCheck<T, OPTION = T>(
  conf: UseCheckConf<T, OPTION>
): UseCheckReturns<T, OPTION> {
  const { options = [], disables = [], collector, notExistValueTrigger } = conf;

  /* ⚠ 用最少的循环实现功能，因为option可能包含巨量的数据 */
  const self = useSelf({
    /** 存放所有选项的字典 */
    optMap: {} as { [key: string]: OPTION },
    /** 存放所有已选值的字典 */
    valMap: {} as { [key: string]: { v: T; o: OPTION } },
    /** 存放checked中存在，但是options中不存在的值, used为是否已通过 */
    notExistVal: {} as { [key: string]: { used: boolean; v: T } },
  });

  const triggerKey = conf.triggerKey || "onChange";

  const [checked, setChecked] = useFormState<T[], OPTION[]>(
    {
      ...conf,
      // 截获onChange并自定义更新逻辑
      [triggerKey](val: T[]) {
        // valMapSync(val); 强控制时在这里同步会有问题，统一转移到effect中
        conf[triggerKey as "onChange"]?.(val, getCheckedOptions(val));
      },
    },
    [],
    conf
  );

  /** 提取所有选项为基础类型值, 基础值数组操作更方便 */
  const items = useMemo(() => {
    return collector
      ? options.map((item) => {
          const v = collector(item);
          self.optMap[String(v)] = item;
          return collector(item);
        })
      : options.map<T>((item: any) => {
          self.optMap[String(item)] = item;
          return item;
        });
  }, [options]);

  /** 初始化触发valMap */
  useMemo(() => {
    valMapSync(checked);
  }, [checked]);

  const isChecked = useFn((val: T) => {
    const v: any = val;
    return !!self.valMap[v] || !!self.notExistVal[v];
  });

  const isDisabled = useFn((val: T) => disables.includes(val));

  const check = useFn((val: T) => {
    if (isDisabled(val)) return;
    if (!isChecked(val)) {
      setChecked([...checked, val]);
    }
  });

  const unCheck = useFn((val: T) => {
    if (isDisabled(val)) return;
    if (!isChecked(val)) return;
    const index = checked.indexOf(val);
    if (index !== -1) {
      const temp = [...checked];
      temp.splice(index, 1);
      setChecked(temp);
    }
  });

  const checkAll = useFn(() => {
    // 只选中当前包含的选项
    setChecked(getEnables());
  });

  const unCheckAll = useFn(() => {
    setChecked(getEnables(false));
  });

  const toggle = useFn((val: T) => {
    if (isDisabled(val)) return;

    const _isC = isChecked(val);

    if (!_isC) {
      setChecked([...checked, val]);
    } else {
      const index = checked.indexOf(val);
      const newArray = checked.slice();
      newArray.splice(index, 1);
      setChecked(newArray);
    }
    return !_isC;
  });

  const toggleAll = useFn(() => {
    const reverse = items.filter((item) => {
      const _isDisabled = isDisabled(item);
      const _isChecked = isChecked(item);
      if (_isDisabled) return _isChecked; // 如果禁用则返回、
      return !_isChecked;
    });
    setChecked(reverse);
  });

  const checkList = useFn((list: T[]) => {
    if (!isArray(list)) return;
    if (!list.length) return;
    // 排除禁用项和已选中项
    const newList = list.filter((item) => {
      if (isDisabled(item)) return false;
      if (isChecked(item)) return false; // isChecked消耗比isDisabled高，所以用`||`判断
      return true;
    });

    setChecked((prev) => [...prev, ...newList]);
  });

  const unCheckList = useFn((removeList: T[]) => {
    if (!isArray(removeList)) return;
    if (!removeList.length) return;
    // 排除禁用项和未选中项
    const rmList = removeList.filter((item) => {
      if (isDisabled(item)) return false;
      return isChecked(item);
    });

    setChecked((prev) => {
      return _difference(prev, rmList);
    });
  });

  const setCheck = useFn((nextChecked: T[]) => {
    // 只选中列表中未被禁用的项
    const extra = nextChecked.filter((item) => {
      if (isDisabled(item)) {
        return isChecked(item);
      }
      return true;
    });
    setChecked([...extra]);
  });

  const setCheckBy = useFn((val: T, _isChecked: boolean) => {
    if (isDisabled(val)) return;
    _isChecked ? check(val) : unCheck(val);
  });

  /** 获取可用选项，禁用项会以原样返回， 传入false时，返回所有未禁用项 */
  function getEnables(isCheck = true) {
    return items.filter((item) => {
      const _isDisabled = isDisabled(item);
      if (_isDisabled) {
        return isChecked(item);
      }
      return isCheck;
    });
  }

  /** 获取所有已选中的选项 */
  function getCheckedOptions(_checked: T[]) {
    if (!collector) return _checked as unknown as OPTION[];

    const temp: OPTION[] = [];

    _checked.forEach((item) => {
      const c = self.optMap[String(item)];
      if (c) {
        temp.push(c);
      }
    });

    return temp;
  }

  /** 判断是否局部选中, 是否所有选中 */
  function getCheckStatus() {
    let checkLen = 0;
    const maxLength = items.length;
    items.forEach((item) => {
      if (isChecked(item)) {
        checkLen++;
      }
    });
    return {
      /** 部分值被选中 */
      partialChecked: checkLen > 0 && checkLen !== maxLength,
      /** 是否全部选中 */
      allChecked: checkLen === maxLength,
    };
  }

  /** 同步valMap, 触发notExistVal  */
  function valMapSync(_checked: T[]) {
    if (!isArray(_checked)) return; // 在rc-form库中使用时，热更新会报错

    const prevNotExits = { ...self.notExistVal };

    self.valMap = {};
    self.notExistVal = {};

    _checked.forEach((item) => {
      const strItem = String(item);

      const c = self.optMap[strItem];

      if (c) {
        self.valMap[strItem] = {
          v: item,
          o: self.optMap[strItem],
        };
      } else {
        const prev = prevNotExits[strItem];

        self.notExistVal[strItem] = {
          used: prev ? prev.used : false,
          v: item,
        };
      }
    });

    // 通知选中但不存在的选项到notExistValueTrigger
    if (notExistValueTrigger) {
      const notOptionValues: T[] = [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(self.notExistVal).forEach(([_, v]) => {
        if (!v.used) {
          v.used = true;
          notOptionValues.push(v.v);
        }
      });

      notOptionValues.length && notExistValueTrigger(notOptionValues);
    }
  }

  /**
   * checked可以允许存在options中不存在的值， 所有选中, 局部选中都只针对传入选项来确定 */
  return {
    ...getCheckStatus(),
    checked,
    originalChecked: getCheckedOptions(checked),
    noneChecked: checked.length === 0,
    isChecked,
    isDisabled,
    check,
    unCheck,
    checkAll,
    unCheckAll,
    toggle,
    toggleAll,
    setChecked: setCheck,
    setCheckBy,
    checkList,
    unCheckList,
  };
}
