import { isArray, isBoolean, isNumber } from '@lxjx/utils';
import _clamp from 'lodash/clamp';
import _debounce from 'lodash/debounce';
import { useFn } from '@lxjx/hooks';
import { isTruthyArray, sizeMap } from './common';
import { TreeNode, Share, TreeValueType } from './types';

export function useMethods(share: Share) {
  const { props, openCheck, valCheck, nodes, self, setState } = share;
  const { itemHeight, identWidth } = props;

  /** 检测某项是否展开 */
  function isShow(item: TreeNode) {
    if (item.zIndex === 0) return true;

    const parents = item.parents;
    if (!isTruthyArray(parents)) return false;

    const p = parents![parents!.length - 1];

    if (!p) return false;

    return openCheck.isChecked(p.value);
  }

  /** 获取传入节点和它的子孙节点的value数组 */
  function getSelfAndDescendants(item: TreeNode) {
    const all = [item.value];

    if (isArray(item.descendantsValues)) {
      all.push(...item.descendantsValues);
    }

    return all;
  }

  /** 获取传入节点和它的子孙节点的数组 */
  function getSelfAndDescendantsItem(item: TreeNode) {
    const all = [item];

    if (isArray(item.descendants)) {
      all.push(...item.descendants);
    }

    return all;
  }

  /** 获取传入节点和它的父节点点的数组 */
  function getSelfAndParents(item: TreeNode) {
    const all = [item.value];

    if (isArray(item.parentsValues)) {
      all.unshift(...item.parentsValues);
    }

    return all;
  }

  /** 根据参数计算返回itemHeight和identWidth的值 */
  function getSize() {
    const size = {
      itemHeight: itemHeight!,
      identWidth: identWidth!,
    };

    const hasH = isNumber(itemHeight);
    const hasW = isNumber(identWidth);

    // 优先使用直接传入的尺寸
    if (hasH && hasW) return size;

    // 回退尺寸
    const builtIn = sizeMap[props.size || 'default'];

    if (!hasH) {
      size.itemHeight = builtIn.h;
    }

    if (!hasW) {
      size.identWidth = builtIn.identW;
    }

    return size;
  }

  /** 获取要显示的列表 */
  function getShowList(list: TreeNode[], keyword?: string) {
    if (keyword) {
      const filterList = list.filter(item => {
        return item.fullSearchKey.indexOf(keyword) !== -1;
      });
      return filterList.filter(isShow);
    }

    return list.filter(isShow);
  }

  /** 展开所有项 */
  function openAll() {
    if (!nodes) return;
    openCheck.setChecked(nodes.expandableValues);
  }

  /** 展开到第几级(0开始)，超出或小于时会自动限定在界定层级 */
  function openToZ(z: number) {
    if (!nodes) return;
    if (!isNumber(z)) return;

    const zList = nodes.zListValues;

    const _z = _clamp(z, 0, zList.length - 1);

    const values = zList.slice(0, _z).reduce((p, i) => [...p, ...i], []);

    openCheck.setChecked(values);
  }

  /** 设置指定节点状态，并同步更新其所有父节点的选中状态，如果省略checked参数，则仅对父节点进行更新 */
  function syncParentsChecked(item: TreeNode, checked?: boolean) {
    const checkList: TreeValueType[] = [];
    const unCheckList: TreeValueType[] = [];

    let i = item;
    // 当前项选中状态
    let lastCheck = checked;

    // 传入value时，以value设置当前项的值
    if (isBoolean(checked)) {
      // valCheck.setCheckBy(item.value, checked);
      checked ? checkList.push(item.value) : unCheckList.push(item.value);
    } else {
      lastCheck = valCheck.isChecked(item.value);
    }

    while (isTruthyArray(i.parents)) {
      const lastP = i.parents![i.parents!.length - 1];

      // 该项所有不含自身的兄弟节点
      const noSelfSiblings: TreeValueType[] = [];
      // 兄弟节点中是否包含禁用项
      let hasDisabled = false;

      // eslint-disable-next-line no-loop-func
      i.siblings.forEach(it => {
        if (it.value !== i.value) {
          noSelfSiblings.push(it.value);
        }
        if (it.disabled) {
          hasDisabled = true;
        }
      });

      // 有禁用项时、取消其所有父级选中并打断循环
      if (hasDisabled) {
        i.parentsValues && unCheckList.push(...i.parentsValues);
        break;
      }

      // 所有兄弟节点均已选中
      const allCheck = noSelfSiblings.every(valCheck.isChecked) && lastCheck;

      allCheck ? checkList.push(lastP.value) : unCheckList.push(lastP.value);

      i = lastP;
      lastCheck = allCheck; // 当所有项的选中状态决定下一个父节点的选中状态
    }

    valCheck.unCheckList(unCheckList);

    setTimeout(() => {
      valCheck.checkList(checkList);
    });
  }

  /** 滚动处理 */
  const scrollHandle = useFn(() => {
    self.scrollingCheckTimer && clearTimeout(self.scrollingCheckTimer);

    self.scrolling = true;

    self.scrollingCheckTimer = setTimeout(() => {
      self.scrolling = false;
    }, 300 /* 不需要严格精准 */);
  });

  /** 关键词变更 */
  const keywordChangeHandle = useFn(
    keyword => {
      setState({
        keyword,
      });
    },
    fn => _debounce(fn, 300),
  );

  return {
    isShow,
    openAll,
    openToZ,
    getSelfAndDescendants,
    getSelfAndParents,
    getSize,
    getShowList,
    scrollHandle,
    keywordChangeHandle,
    syncParentsChecked,
    getSelfAndDescendantsItem,
  };
}
