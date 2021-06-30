import React, { useEffect, useRef } from 'react';
import TreeItem from './_item';
import { VirtualItemProps } from './_types';

/** 虚拟滚动到实际Item的中间站 */
export const VirtualItem = (props: VirtualItemProps) => {
  const { index, data, size } = props;
  const { scrolling, ...itemProps } = props;

  const firstLoad = useRef(false);

  useEffect(() => {
    if (!firstLoad.current) firstLoad.current = true;
  }, []);

  if (!firstLoad.current && scrolling) {
    return (
      <div className="m78-tree_skeleton" style={{ height: size.itemHeight }}>
        {data.parents &&
          data.parents.map(i => (
            <span key={i.value} style={{ width: itemProps.size.identWidth }} />
          ))}
        <span
          className="m78-tree_skeleton-bar"
          style={{ width: itemProps.size.itemHeight * 0.68 }}
        />
        <span className="m78-tree_skeleton-bar">{data.origin.label}</span>
      </div>
    );
  }

  return <TreeItem {...itemProps} index={index} />;
};
