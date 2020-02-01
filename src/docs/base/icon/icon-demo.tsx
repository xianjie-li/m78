import React from 'react';
import Icon from '@lxjx/flicker/lib/icon';
import '@lxjx/flicker/lib/icon/style';

const IconDemo = () => {
  return (
    <div>
      <Icon type="setting" size={30} />
      <Icon type="search" size={30} />
      <Icon type="plus" size={30} />
      <Icon type="ellipsis" size={30} />
      <Icon type="sync" size={30} spin />
      <Icon.SvgIcon type="success" size={30} />
      <Icon.SvgIcon type="error" size={30} />
      <Icon.SvgIcon type="warning" size={30} />
    </div>
  );
};

export default IconDemo;
