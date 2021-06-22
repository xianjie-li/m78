import { isArray, isBoolean, isNumber } from '@lxjx/utils';
import _clamp from 'lodash/clamp';
import { Share, TreeBaseNode, TreeNode, TreeValueType } from './types';
import { isTruthyArray } from './common';

/*
 * ########################################
 * 对外暴露给其他包含同等功能组件的操作函数
 * ########################################
 * */

/** 检测某项是否展开 */
function isShow(treeState: Share['treeState'], item: TreeBaseNode) {
  if (item.zIndex === 0) return true;

  const parents = item.parents;
  if (!isTruthyArray(parents)) return false;

  const p = parents![parents!.length - 1];

  if (!p) return false;

  return treeState.openChecker.isChecked(p.value);
}

/** 获取传入节点和它的子孙节点的value数组 */
function getSelfAndDescendants(item: TreeBaseNode) {
  const all = [item.value];

  if (isArray(item.descendantsValues)) {
    all.push(...item.descendantsValues);
  }

  return all;
}

/** 获取传入节点和它的子孙节点的数组 */
function getSelfAndDescendantsItem(item: TreeBaseNode) {
  const all = [item];

  if (isArray(item.descendants)) {
    all.push(...item.descendants);
  }

  return all;
}

/** 获取传入节点和它的父节点点的数组 */
function getSelfAndParents(item: TreeBaseNode) {
  const all = [item.value];

  if (isArray(item.parentsValues)) {
    all.unshift(...item.parentsValues);
  }

  return all;
}

/** 展开所有项 */
function openAll(treeState: Share['treeState']) {
  const nodes = treeState.state.nodes;

  if (!nodes) return;
  treeState.openChecker.setChecked(nodes.expandableValues);
}

/** 展开到第几级(0开始)，超出或小于时会自动限定在界定层级 */
function openToZ(treeState: Share['treeState'], z: number) {
  const nodes = treeState.state.nodes;

  if (!nodes) return;
  if (!isNumber(z)) return;

  const zList = nodes.zListValues;

  const _z = _clamp(z, 0, zList.length - 1);

  const values = zList.slice(0, _z).reduce((p, i) => [...p, ...i], []);

  treeState.openChecker.setChecked(values);
}

/** 设置指定节点选中状态，并同步更新其所有父节点的选中状态，如果省略checked参数，则仅对父节点进行更新 */
function syncParentsChecked(treeState: Share['treeState'], item: TreeBaseNode, checked?: boolean) {
  const valChecker = treeState.valChecker;

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
    lastCheck = valChecker.isChecked(item.value);
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
    const allCheck = noSelfSiblings.every(valChecker.isChecked) && lastCheck;

    allCheck ? checkList.push(lastP.value) : unCheckList.push(lastP.value);

    i = lastP;
    lastCheck = allCheck; // 当所有项的选中状态决定下一个父节点的选中状态
  }

  valChecker.unCheckList(unCheckList);

  setTimeout(() => {
    valChecker.checkList(checkList);
  });
}

function scrollHandle(treeState: Share['treeState']) {
  const self = treeState.self;
  self.scrollingCheckTimer && clearTimeout(self.scrollingCheckTimer);

  self.scrolling = true;

  self.scrollingCheckTimer = setTimeout(() => {
    self.scrolling = false;
  }, 300 /* 不需要严格精准 */);
}

// 减少命名污染
export default {
  isShow,
  getSelfAndDescendants,
  getSelfAndDescendantsItem,
  getSelfAndParents,
  openAll,
  openToZ,
  syncParentsChecked,
  scrollHandle,
};
