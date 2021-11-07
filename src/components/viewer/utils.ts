/** 根据bound元素和目标元素获取可用bound信息 */
export function getBoundMeta(boundEl: Element, target: Element) {
  const boundRect = boundEl.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const top = -(targetRect.top - boundRect.top);
  const bottom = -(targetRect.bottom - boundRect.bottom);
  const left = -(targetRect.left - boundRect.left);
  const right = -(targetRect.right - boundRect.right);

  return {
    left,
    right,
    top,
    bottom,
  };
}
