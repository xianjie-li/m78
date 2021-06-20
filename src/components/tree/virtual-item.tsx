import React, { useEffect, useState } from 'react';
import TreeItem from './item';
import { VirtualItemProps } from './types';

export const VirtualItem = ({ index, style, data }: VirtualItemProps) => {
  const { data: list, ...itemProps } = data;

  const item = list[index];

  // 使用低消耗的渲染占位，一定延迟后再切换真实节点，防止快速滚动、拖动造成不必要的计算消耗
  const [render, setRender] = useState(!itemProps.share.self.scrolling);

  const placeholderCustomer = itemProps.share.props.customer?.placeholder;

  useEffect(() => {
    if (render) return;

    const t = setTimeout(() => {
      setRender(true);
    }, 100);
    return () => clearTimeout(t);
  }, []);

  if (!render) {
    if (placeholderCustomer) {
      return placeholderCustomer({
        style,
        data: item,
        itemProps: itemProps as any,
      });
    }

    return (
      <div style={style} className="m78-tree_skeleton">
        {item.parents &&
          item.parents.map(i => (
            <span key={i.value} style={{ width: itemProps.size.identWidth }} />
          ))}
        <span
          className="m78-tree_skeleton-bar"
          style={{ width: itemProps.size.itemHeight * 0.68 }}
        />
        <span className="m78-tree_skeleton-bar">{item.label}</span>
      </div>
    );
  }

  return <TreeItem data={item} key={item.value} {...itemProps} style={style} index={index} />;
};
