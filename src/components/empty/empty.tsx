import React from 'react';

import { EmptyIcon } from 'm78/icon';

import cls from 'classnames';

import config from 'm78/config';
import { EmptyProps } from './type';

/* 为指定的ReactElement注入m78-empty_icon类 */
function injectIconClassName(el?: React.ReactElement) {
  if (!el) return null;
  return React.cloneElement(el, { className: cls('m78-empty_icon', el.props.className) });
}

const Empty: React.FC<EmptyProps> = ({ desc, children, size, emptyNode, ...props }) => {
  const globalEmptyNode = config.useState(state => state.emptyNode);

  return (
    <div className={cls('m78-empty', size && `__${size}`, props.className)} {...props}>
      {injectIconClassName(emptyNode) || injectIconClassName(globalEmptyNode) || (
        // <Icon.SvgIcon type="empty" />
        <EmptyIcon className="m78-empty_icon" />
      )}
      <div className="m78-empty_desc">{desc}</div>
      <div className="m78-empty_actions">{children}</div>
    </div>
  );
};

export default Empty;
