import React, { useContext } from 'react';

import 'm78/base';
import { Switch, If } from 'm78/fork';
import { statusIcons, RightOutlined, LoadingOutlined } from 'm78/icon';

import Ellipsis from 'm78/ellipsis';

import cls from 'classnames';
import { Title, SubTitle } from './titles';
import Footer from './footer';

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
}) => (
  <div
    className={cls('m78-list', className, {
      __form: form,
      '__not-border': notBorder,
      __vertical: layout === 'vertical',
      __inline: column > 1,
      '__full-width': fullWidth,
      __disabled: disabled,
    })}
    {...props}
  >
    <Context.Provider value={{ form: !!form, column }}>{children}</Context.Provider>
  </div>
);

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
  required,
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

  const StatusIcon = (statusIcons as any)[status!];

  return (
    <div
      className={cls('m78-list_item __md', className, status && `__${status}`, {
        __disabled: disabled,
        'm78-effect': hasEffect,
      })}
      style={{ ...itemStyle, ...style }}
      {...props}
    >
      <div className={cls('m78-list_left', leftAlign && `__${leftAlign}`)}>{left}</div>
      <div className="m78-list_cont">
        <div className="m78-list_cont-left">
          <Ellipsis line={titleEllipsis} className={cls('m78-list_title')}>
            {title}
            {required && (
              <i className="m78-list_require" title="必填项">
                *
              </i>
            )}
          </Ellipsis>
          {desc && (
            <Ellipsis className={cls('m78-list_desc')} line={descEllipsis}>
              {desc}
            </Ellipsis>
          )}
        </div>
        {isForm && <div className="m78-list_cont-right">{children}</div>}
      </div>
      <div className="m78-list_right">{extra}</div>
      <div className="m78-list_icon">
        {/* icon显示优先级: 状态 > icon > arrow */}
        <Switch>
          <If when={status}>
            {() =>
              status === 'loading' ? (
                <LoadingOutlined spin />
              ) : (
                <StatusIcon className="m78-list_extra-icon m78-svg-icon" />
              )
            }
          </If>
          <If when={icon}>{icon}</If>
          <If when={arrow && !icon}>
            <RightOutlined />
          </If>
        </Switch>
      </div>
      <If when={extra && isForm}>
        <div className="m78-list_extra __gray">{extra}</div>
      </If>
      <If when={!!footLeft || !!footRight}>
        <div className="m78-list_extra">
          <div>{footLeft}</div>
          <div className="m78-list_extra-second">{footRight}</div>
        </div>
      </If>
    </div>
  );

  // return React.createElement(
  //   isForm ? 'div' : 'div',
  //   {
  //     className: cls('m78-list_item __md', className, status && `__${status}`, {
  //       __disabled: disabled,
  //       'm78-effect': hasEffect,
  //     }),
  //     style: { ...itemStyle, ...style },
  //     ...props,
  //   },
  //   <>
  //
  //   </>,
  // );
};

type List = typeof _List;

interface ListWithExtra extends List {
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

export { Item, Title, SubTitle, Footer };
export default List;
