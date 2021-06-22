import { TreeDataSourceItem } from 'm78/tree';

/** 指定长度、深度、label来生成模拟的treedata */
export default function mockTreeData(length: number, z: number, label = '选项') {
  const ls: TreeDataSourceItem[] = [];

  function gn(list: TreeDataSourceItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: TreeDataSourceItem[] = [];

      const current: TreeDataSourceItem = {
        label: `${label} ${v}`,
        value: v,
        children: Math.random() > 0.5 ? [] : undefined,
      };

      list.push(current);

      if (cZInd !== z) {
        current.children = children;
        gn(children, v, cZInd + 1);
      }
    });
  }

  gn(ls, '');

  return ls;
}
