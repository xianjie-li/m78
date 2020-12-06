import React, { useMemo } from 'react';

import Spin from 'm78/spin';
import 'm78/base';
import { isArray } from '@lxjx/utils';

import cls from 'classnames';

import { ButtonPropsWithHTMLButton, ButtonPropsWithHTMLLink } from './type';

const sizeMap = {
  large: 12,
  small: 8,
  mini: 6,
};

const matchIcon = /.?(Outlined|Filled|TwoTone|Icon)$/;

/* 该函数用于遍历Button的children，当存在Icon和SvgIcon时(非函数匹配, 函数组件name能就会添加)，为其添加适当边距并返回 */
function formatChildren(children: React.ReactNode) {
  const offset = 4;

  if (isArray(children)) {
    return children.map((child, index) => {
      const type = (child as any)?.type;
      let name: string = '';

      if (type) {
        name = type.render?.displayName || type.render?.name || type.name;
      }

      /* 为满足matchIcon规则的子元素添加边距 */
      if (name && React.isValidElement(child) && matchIcon.test(name)) {
        let injectStyle: React.CSSProperties = { marginLeft: offset, marginRight: offset };
        if (index === 0) {
          injectStyle = { marginRight: offset };
        }

        if (index === children.length - 1) {
          injectStyle = { marginLeft: offset };
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

function Button(btnProps: ButtonPropsWithHTMLLink): JSX.Element;
function Button(btnProps: ButtonPropsWithHTMLButton): JSX.Element;
function Button(btnProps: ButtonPropsWithHTMLLink | ButtonPropsWithHTMLButton) {
  const {
    size,
    color,
    circle,
    outline,
    block,
    icon,
    disabled,
    loading,
    md,
    win,
    children,
    className,
    text,
    href,
    shadow = true,
    ...props
  } = btnProps as ButtonPropsWithHTMLLink & ButtonPropsWithHTMLButton;

  const classNames = cls(className, 'm78-btn', 'm78-effect', {
    [`__${color}`]: color,
    [`__${size}`]: size,
    __circle: circle,
    __outline: outline,
    __block: block,
    __text: text,
    __icon: icon,
    __md: md,
    __win: win,
    __light: !!color && !text && !icon, // 当是link/icon按钮时，可以直接使用对应颜色的波纹
    __shadow: shadow,
    __disabled: disabled || loading,
  });

  const newChildren = useMemo(() => formatChildren(children), [children]);

  const isLink = !!href;

  return React.createElement(
    href ? 'a' : 'button',
    {
      type: isLink ? undefined : 'button', // 禁用默认的submit类型
      href,
      ...props,
      className: classNames,
      disabled: !!disabled || !!loading,
    },
    <>
      <Spin
        style={{ fontSize: size ? sizeMap[size] : 10, color: '#333' }}
        show={!!loading}
        full
        text=""
      />
      <span>{newChildren}</span>
    </>,
  );
}

export default Button;
