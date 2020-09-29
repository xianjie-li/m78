import React from 'react';
import { TabItemProps } from 'm78/tab/type';

const TabItem: React.FC<TabItemProps> = ({ children, disabled, value, label, ...oProps }) => {
  return <div {...oProps}>{children}</div>;
};

export default TabItem;
