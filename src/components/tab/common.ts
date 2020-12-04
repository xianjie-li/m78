import { isArray, isTruthyOrZero } from '@lxjx/utils';
import { TabItem } from 'm78/tab';
import { TabItemElement } from './type';

/** 格式化子项，确保其格式为Tab[], 如果每一个TabItem子项都不含内容时，hasContent为false */
export function formatChild(children?: TabItemElement | TabItemElement[]) {
  let hasContent = false;
  const values: Array<string | number> = [];

  if (!children)
    return {
      child: [],
      hasContent,
      values,
    };

  const list = isArray(children) ? children : [children];

  const resList = list.filter(item => {
    if (isTruthyOrZero(item.props.children)) hasContent = true;
    values.push(item.props.value);
    return item.type === TabItem;
  });

  return {
    child: resList,
    hasContent,
    values,
  };
}

/** 从一组ReactElement<TabItemProps>中拿到props组成的数组 */
export function getChildProps(children: TabItemElement[]) {
  return children.map(item => item.props);
}

/** 根据当前value和values获取索引, 无匹配时默认为0 */
export function getIndexByVal(val: any, vals: Array<string | number>) {
  const ind = vals.indexOf(val);
  return ind === -1 ? 0 : ind;
}
