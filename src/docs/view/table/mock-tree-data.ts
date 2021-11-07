import { TableDataSourceItem } from 'm78/table';

let count = 0;

/** 指定长度、深度生成模拟的tree data */
export function mockTreeData(length: number, z: number) {
  const ls: TableDataSourceItem[] = [];

  function gn(list: TableDataSourceItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: TableDataSourceItem[] = [];

      const current: TableDataSourceItem = {
        id: v,
        name: `欧尼斯特 ${++count}`,
        jName: 'オネスト',
        race: '天使',
        property: '光',
        level: '4',
        atk: '1100',
        def: '1900',
        // children: Math.random() > 0.5 ? [] : undefined,
        desc:
          '自己的主要阶段可以发动。使场上的表侧表示的这张卡返回持有者的手牌。②：自己的光属性怪兽进行战斗的从伤害步骤开始时到伤害计算前，可以将这张卡从手牌送入墓地发动。那只怪兽的攻击力直到回合结束时上升进行战斗的对手怪兽的攻击力数值。',
        rare: '立体UTR.',
      };

      list.push(current);

      if (cZInd !== z) {
        current.children = children;
        gn(children, v, cZInd + 1);
      }
    });
  }

  gn(ls, '');

  count = 0;

  return ls;
}
