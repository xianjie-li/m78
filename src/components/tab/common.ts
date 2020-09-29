import { isArray } from '@lxjx/utils';
import { TabItem } from 'm78/tab';
import { TabItemElement } from './type';

/** 格式化子项，确保其格式为Tab[] */
export function formatChild(children?: TabItemElement | TabItemElement[]) {
  if (!children) return [];

  const list = isArray(children) ? children : [children];

  return list.filter(item => {
    return item.type === TabItem;
  });
}

/** 从一组ReactElement<TabItemProps>中拿到props组成的数组 */
export function getChildProps(children: TabItemElement[]) {
  return children.map(item => item.props);
}
