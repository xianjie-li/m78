import { ListView, ListViewItem, ListViewItemStyleEnum } from 'm78/list-view';
import React from 'react';
import clsx from 'clsx';
import { DirectionEnum } from 'm78/common';
import { FormItemLayoutProps, FormLayoutProps } from './type';

export function FormLayout({
  className,
  children,
  layout = DirectionEnum.vertical,
  itemStyle = ListViewItemStyleEnum.none,
  style,
  ...ppp
}: FormLayoutProps) {
  return (
    <ListView
      {...ppp}
      effect={false}
      itemStyle={itemStyle}
      className={clsx('m78 m78-form', layout && `__${layout}`, className)}
    >
      {children}
    </ListView>
  );
}

export function FormItemLayout({
  label,
  children,
  desc,
  errorNode,
  required,
  innerRef,
  className,
  ...ppp
}: FormItemLayoutProps) {
  return (
    <ListViewItem
      {...ppp}
      innerRef={innerRef}
      className={clsx('m78-form_item', className)}
      titleEllipsis={0}
      title={
        <div className="m78-form_item-main">
          {label && (
            <div className="m78-form_item-label">
              {label}
              {required && (
                <i className="m78-form_require-mark" title="必填项">
                  *
                </i>
              )}
            </div>
          )}
          <div className="m78-form_item-cont">
            <div className="m78-form_item-unit-wrap">{children}</div>
            {desc && (
              <div className="m78-form_item-text-wrap">
                <div className="m78-form_item-text">{desc}</div>
              </div>
            )}
            {errorNode && (
              <div className="m78-form_item-tips-text ellipsis-2" title={errorNode as string}>
                {errorNode}
              </div>
            )}
          </div>
        </div>
      }
    />
  );
}

export const FormActions: React.FC = ({ children }) => {
  return <div className="m78-form_actions">{children}</div>;
};
