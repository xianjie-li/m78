import {useCallback, useRef, useState} from "react";
import {isArray} from "@lxjx/utils";

export function useCheck<T, OPTION = T>(
  options = [] as OPTION[],
  defaultCheck = [] as T[],
  collector?: (item: OPTION) => T,
) {
  /* 将关键参数转为ref，使以下各个callback能够安全引用到它们而不需要变更引用，从而减少消费组件的render次数 */
  const refOptions = useRef(options);
  refOptions.current = options;

  const [checked, setChecked] = useState<OPTION[]>(() => {
    // 从options中挑选出默认值
    if (isArray(defaultCheck) && defaultCheck.length) {
      return getCheckOptionByValues(defaultCheck);
    }
    return [];
  });

  const refChecked = useRef(checked);
  refChecked.current = checked;

  /** 传入一组选项值id来获取实际的选项 */
  function getCheckOptionByValues(values: T[]): OPTION[] {
    return options.filter(item => {
      return values.includes(pickItem(item));
    });
  }

  /** 根据是否有collector来获取正确的item */
  function pickItem(item: OPTION) {
    return collector ? collector(item) : (item as any);
  }

  /** 根据值获取到该值所在索引和其对应的选项 */
  function getIndex(val: T) {
    // 获取当前项, 如果collector存在用其获取val所在项
    const current = collector
      ? refOptions.current.find(item => pickItem(item) === val)
      : val;

    // 获取值当前在选中项中的索引
    const index = refChecked.current.findIndex(item => pickItem(item) === val);
    return [index, current] as [number, OPTION | undefined];
  }

  const isChecked = useCallback(
    (val: T) => {
      const [ind, current] = getIndex(val);
      if (!current) return false;
      return ind !== -1;
    },
    [],
  );

  const check = useCallback(
    (val: T) => {
      const [ind, current] = getIndex(val);
      if (!current) return;
      if (ind === -1) {
        setChecked(prev => [...prev, current]);
      }
    },
    [],
  );

  const unCheck = useCallback(
    (val: T) => {
      const [ind, current] = getIndex(val);
      if (!current) return;
      if (ind !== -1) {
        const newArray = [...refChecked.current];
        newArray.splice(ind, 1);
        setChecked(newArray);
      }
    },
    [],
  );

  const checkAll = useCallback(() => {
    setChecked([...refOptions.current]);
  }, []);

  const unCheckAll = useCallback(() => {
    setChecked([]);
  }, []);

  const toggle = useCallback(
    (val: T) => {
      const [ind, current] = getIndex(val);
      if (!current) return false;
      /* 不使用unCheck/check, 减少遍历次数 */
      if (ind === -1) {
        setChecked(prev => [...prev, current]);
      } else {
        const newArray = [...refChecked.current];
        newArray.splice(ind, 1);
        setChecked(newArray);
      }
      return ind !== -1;
    },
    [],
  );

  const toggleAll = useCallback(() => {
    const reverse = refOptions.current.filter(item => {
      return !refChecked.current.find(check => pickItem(check) === pickItem(item));
    });
    setChecked(reverse);
  }, []);

  const setCheck = useCallback((checked: T[]) => {
    const newCheck = getCheckOptionByValues(checked);
    setChecked(newCheck);
  }, []);

  const setCheckBy = useCallback((val: T, checked: boolean) => {
    checked ? check(val) : unCheck(val);
  }, []);

  return {
    /** 被选中值, 存在collector时会先通过collector遍历挑选 */
    checked: (collector ? checked.map(item => collector(item)) : checked) as T[],
    /** 被选中的原始值，不走collector，未传collector时与check一致 */
    originalChecked: checked,
    /** 是否全部选中 */
    allChecked: options.length === checked.length,
    /** 没有任何值被选中 */
    noneChecked: checked.length === 0,
    /** 部分值被选中 */
    partialChecked: checked.length !== 0 && options.length !== checked.length,
    /** 选中传入的值 */
    check,
    /** 选择全部值 */
    checkAll,
    /** 取消选中传入的值 */
    unCheck,
    /** 取消选中所有值 */
    unCheckAll,
    /** 检测值是否被选择 */
    isChecked,
    /** 一次性设置所有选中的值 */
    setChecked: setCheck,
    /** 指定值并设置其选中状态 */
    setCheckBy,
    /** 反选, 返回反选后的值 */
    toggle,
    /** 反选所有值 */
    toggleAll,
  };
}
