import React, { useMemo } from 'react';

import Spin from '@lxjx/fr/lib/spin';
import '@lxjx/fr/lib/base';
import { isArray, isFunction } from '@lxjx/utils';

import cls from 'classnames';

import { ButtonProps } from './type';

const sizeMap = {
  large: 18,
  small: 14,
  mini: 12,
};

/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(非函数匹配, 函数组件name能就会添加)，为其添加适当边距并返回 */
function formatChildren(children: React.ReactNode) {
  if (isArray(children)) {
    return children.map((child, index) => {
      /* 这里直接匹配函数name是为了防止仅使用Button组件而需要导入Icon组件 */
      if (
        React.isValidElement(child) &&
        isFunction(child.type) &&
        (child.type.name === 'Icon' || child.type.name === 'SvgIcon')
      ) {
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
  const classNames = cls(className, 'fr-btn', 'fr-effect', {
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
      {link && <a className="fr-btn__link" href={href} />}
      <Spin style={{ fontSize: size ? sizeMap[size] : 14 }} show={!!loading} full text="" />
      <span>{newChildren}</span>
    </button>
  );
};

export default Button;
