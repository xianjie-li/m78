import React, { useContext } from 'react';

import '@lxjx/flicker/lib/base';
import { Switch, If } from '@lxjx/flicker/lib/fork';
import Icon from '@lxjx/flicker/lib/icon';

import Ellipsis from '@lxjx/flicker/lib/ellipsis';

import { Title, SubTitle } from './titles';
import Footer from './footer';

import cls from 'classnames';

import { ListType, ListItemProps } from './type';

const Context = React.createContext({
  form: false,
  column: 0,
});

const _List: React.FC<ListType> = ({
  children,
  form = false,
  notBorder = false,
  column = 1,
  layout = 'vertical',
  fullWidth = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cls(
        'fr-list',
        className,
        {
          __form: form,
          '__not-border': notBorder,
          __vertical: layout === 'vertical',
          __inline: column > 1,
          '__full-width': fullWidth,
          __disabled: disabled,
        },
      )}
      {...props}
    >
      <Context.Provider value={{ form: !!form, column }}>
        {children}
      </Context.Provider>
    </div>
  );
};

const Item: React.FC<ListItemProps> = ({
  left,
  leftAlign,
  title,
  desc,
  extra,
  footLeft,
  footRight,
  arrow,
  effect,
  icon,
  disabled,
  status,
  children,
  require,
  titleEllipsis = 2,
  descEllipsis = 3,
  className,
  style,
  ...props
}) => {
  const { form: isForm, column } = useContext(Context);
  /* 点击效果出现的条件: 非表单列表、非禁用、带右箭头或带事件 */
  const hasEffect = !isForm && !disabled && (arrow || props.onClick || effect);
  const itemStyle = column > 1 ? { width: `${100 / column}%` } : {};

  return React.createElement(isForm ? 'label' : 'div', {
    className: cls(
      'fr-list_item __md',
      className,
      status && `__${status}`,
      {
        __disabled: disabled,
        'fr-effect': hasEffect,
      },
    ),
    style: { ...itemStyle, ...style },
    ...props,
  }, (
    <>
      <div className={cls('fr-list_left', leftAlign && `__${leftAlign}`)}>{left}</div>
      <div className="fr-list_cont">
        <div className="fr-list_cont-left">
          <Ellipsis line={titleEllipsis} className={cls('fr-list_title')}>
            {title}
            {require && <i className="fr-list_require">*</i>}
          </Ellipsis>
          {desc && <Ellipsis className={cls('fr-list_desc')} line={descEllipsis}>{desc}</Ellipsis>}
        </div>
        {isForm && <div className="fr-list_cont-right">{children}</div>}
      </div>
      <div className="fr-list_right">{extra}</div>
      <div className="fr-list_icon">
        {/* icon显示优先级: 状态 > icon > arrow */}
        <Switch>
          <If when={status}>
            {status === 'success' && (
              <svg className="fr-list_extra-icon fr-svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-result_success" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="fr-list_extra-icon fr-svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-result_error" />
              </svg>
            )}
            {status === 'warning' && (
              <svg className="fr-list_extra-icon fr-svg-icon" aria-hidden="true">
                <use xlinkHref="#icon-result_warn" />
              </svg>
            )}
          </If>
          <If when={icon}>
            {icon}
          </If>
          <If when={arrow && !icon}>
            <Icon type="right" />
          </If>
        </Switch>
      </div>
      <If when={!!footLeft || !!footRight}>
        <div className="fr-list_extra">
          <div>
            {footLeft}
          </div>
          <div className="fr-list_extra-second">{footRight}</div>
        </div>
      </If>
    </>
  ));
};

type List = typeof _List;

interface ListWithExtra extends List{
  Item: typeof Item;
  Title: typeof Title;
  SubTitle: typeof SubTitle;
  Footer: typeof Footer;
}

const List: ListWithExtra = Object.assign(_List, {
  Item,
  Title,
  SubTitle,
  Footer,
});

export {
  Item,
  Title,
  SubTitle,
  Footer,
};
export default List;
