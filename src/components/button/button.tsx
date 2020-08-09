import React, { useMemo } from 'react';

import Spin from 'm78/spin';
import 'm78/base';
import { isArray } from '@lxjx/utils';

import cls from 'classnames';

import { ButtonProps } from './type';

const sizeMap = {
  large: 18,
  small: 14,
  mini: 12,
};

const matchIcon = /.?(Outlined|Filled|TwoTone|Icon)$/;

/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(非函数匹配, 函数组件name能就会添加)，为其添加适当边距并返回 */
function formatChildren(children: React.ReactNode) {
  if (isArray(children)) {
    return children.map((child, index) => {
      const type = (child as any)?.type;
      let name: string = '';

      if (type) {
        name = type.render?.displayName || type.render?.name || type.name;
      }

      /* 为满足matchIcon规则的子元素添加边距 */
      if (name && React.isValidElement(child) && matchIcon.test(name)) {
        let injectStyle: React.CSSProperties = { marginLeft: 8, marginRight: 8 };
        if (index === 0) {
          injectStyle = { marginRight: 8 };
        }

        if (index === children.length - 1) {
          injectStyle = { marginLeft: 8 };
        }

        const newStyle = { ...child.props.style, ...injectStyle };

        return React.cloneElement(child, { style: newStyle, key: index });
      }
      return child;
    });
  }

  return children;
}

/*
 * large 38
 * default 30
 * small 26
 * mini 20
 * */

const Button: React.FC<ButtonProps> = ({
  size,
  color,
  circle,
  outline,
  block,
  link,
  icon,
  disabled,
  loading,
  md,
  win,
  children,
  className,
  href,
  ...props
}) => {
  const classNames = cls(className, 'm78-btn', 'm78-effect', {
    [`__${color}`]: color,
    [`__${size}`]: size,
    __circle: circle,
    __outline: outline,
    __block: block,
    __link: link,
    __icon: icon,
    __md: md,
    __win: win,
    __light: !!color && !link && !icon, // 当是link/icon按钮时，可以直接使用对于颜色的波纹
    __disabled: disabled || loading,
  });

  const newChildren = useMemo(() => formatChildren(children), [children]);

  return (
    <button type="button" {...props} className={classNames} disabled={!!disabled || !!loading}>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content,jsx-a11y/control-has-associated-label */}
      {link && <a className="m78-btn__link" href={href} />}
      <Spin
        style={{ fontSize: size ? sizeMap[size] : 14, color: '#333' }}
        show={!!loading}
        full
        text=""
      />
      <span>{newChildren}</span>
    </button>
  );
};

export default Button;
