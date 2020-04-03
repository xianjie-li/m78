import { useCallback, useRef, useState } from 'react';
import { isArray } from '@lxjx/utils';

interface UseCheckOptions<T, OPTION> {
  /** 选项数组 */
  options: OPTION[];
  /** 所有默认选中值，不受disables影响 */
  defaultCheck?: T[];
  /** 所有禁用值 */
  disables?: T[];
  /** 当option为特殊类型时(不能通过`===`进行比较)，传入此函数来从option中获取用于对比的值，返回值同样会用于checked结果 */
  collector?: (item: OPTION) => T;
}

export function useCheck<T, OPTION = T>({
  options = [],
  defaultCheck = [],
  disables = [],
  collector,
}: UseCheckOptions<T, OPTION>) {
  /* 将关键参数转为ref，使以下各个callback能够安全引用到它们而不需要变更引用，从而减少消费组件的render次数 */
  const refOptions = useRef(options);
  refOptions.current = options;

  const refDisables = useRef(disables);
  refDisables.current = disables;

  const [checked, setChecked] = useState<OPTION[]>(() => {
    // 从options中挑选出默认值
    if (isArray(defaultCheck) && defaultCheck.length) {
      return getCheckOptionByValues(defaultCheck); /* 默认值不需要禁用 */
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

  /** 根据是否有collector来获取对应的item */
  function pickItem(item: OPTION) {
    return collector ? collector(item) : (item as any);
  }

  /** 根据值获取到该值所在索引和其对应的选项 */
  function getIndex(val: T) {
    // 获取当前项, 如果collector存在用其获取val所在项
    const current = collector ? refOptions.current.find(item => pickItem(item) === val) : val;

    // 获取值当前在选中项中的索引
    const index = refChecked.current.findIndex(item => pickItem(item) === val);
    return [index, current] as [number, OPTION | undefined];
  }

  /** 传入一组value，根据disables来过滤掉其中的禁用元素并返回 */
  function getEnable(values: T[]) {
    if (!refDisables.current.length) return values;
    return values.filter(val => {
      return !refDisables.current.includes(val);
    });
  }

  const isChecked = useCallback((val: T) => {
    const [ind, current] = getIndex(val);
    if (!current) return false;
    return ind !== -1;
  }, []);

  const isDisabled = useCallback((val: T) => {
    return refDisables.current.includes(val);
  }, []);

  /** 从options中获取所有可用的选项，传入false时，从option中排除所有未禁用的选项并返回 */
  function getEnables(isCheck = true) {
    return refOptions.current.filter(option => {
      const current = pickItem(option);
      const _isDisabled = isDisabled(current);

      // 如果是禁用项，原样返回选中状态
      if (_isDisabled) {
        return isChecked(current);
      }
      return isCheck;
    });
  }

  const check = useCallback((val: T) => {
    const enables = getEnable([val]);
    if (!enables.length) return;
    const [ind, current] = getIndex(val);
    if (!current) return;
    if (ind === -1) {
      setChecked(prev => [...prev, current]);
    }
  }, []);

  const unCheck = useCallback((val: T) => {
    const enables = getEnable([val]);
    if (!enables.length) return;
    const [ind, current] = getIndex(val);
    if (!current) return;
    if (ind !== -1) {
      const newArray = [...refChecked.current];
      newArray.splice(ind, 1);
      setChecked(newArray);
    }
  }, []);

  const checkAll = useCallback(() => {
    setChecked([...getEnables()]);
  }, []);

  const unCheckAll = useCallback(() => {
    setChecked([...getEnables(false)]);
  }, []);

  const toggle = useCallback((val: T) => {
    const enables = getEnable([val]);
    if (!enables.length) return;
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
  }, []);

  const toggleAll = useCallback(() => {
    const reverse = refOptions.current.filter(item => {
      const current = pickItem(item);
      const _isDisabled = isDisabled(current);
      const _isChecked = isChecked(current);
      if (_isDisabled) return _isChecked; // 如果禁用则返回当前选中状态
      return !_isChecked;
    });
    setChecked(reverse);
  }, []);

  const setCheck = useCallback((checked: T[]) => {
    // 取所有禁用且选中的值进行合并
    const disabledChecked = getCheckOptionByValues(refDisables.current).filter(item => {
      return isChecked(pickItem(item));
    });
    const newCheck = getCheckOptionByValues(checked);
    setChecked([...newCheck, ...disabledChecked]);
  }, []);

  const setCheckBy = useCallback((val: T, checked: boolean) => {
    const enables = getEnable([val]);
    if (!enables.length) return;
    checked ? check(val) : unCheck(val);
  }, []);

  const checkedDisableLength = checked.filter(item => disables.includes(pickItem(item)));
  const realOptionLength = options.length - disables.length; // 实际选项长度
  const realCheckLength = checked.length - checkedDisableLength.length; // 实际选中长度

  return {
    /** 被选中值, 存在collector时所有check项都会先走collector */
    checked: (collector ? checked.map(item => collector(item)) : checked) as T[],
    /** 被选中的原始值，不走collector，未传collector时与check表现一致 */
    originalChecked: checked,
    /** 是否全部选中 */
    allChecked: realOptionLength === realCheckLength,
    /** 没有任何值被选中 */
    noneChecked: realCheckLength === 0,
    /** 部分值被选中 */
    partialChecked: realCheckLength !== 0 && realOptionLength !== realCheckLength,
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
    /** 检测值是否被禁用 */
    isDisabled,
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
