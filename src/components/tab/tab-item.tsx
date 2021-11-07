import React from 'react';
import { TabItemProps } from 'm78/tab/type';

const TabItem: React.FC<TabItemProps> = ({
  children = null,
  disabled,
  value,
  label,
  ...oProps
}) => {
  return React.isValidElement(children)
    ? React.cloneElement(children, { ...oProps })
    : (children as any);
};

export default TabItem;
