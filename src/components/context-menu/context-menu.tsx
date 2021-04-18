import React, { useState } from 'react';
import Popper, { Bound, PopperDirectionEnum, PopperPropsCustom } from 'm78/popper';
import { Tile } from 'm78/layout';
import classNames from 'classnames';
import { isFunction } from '@lxjx/utils';
import { ContextMenuItemProps, ContextMenuProps } from './types';

/** 定制popper */
const MenuCustomer = (props: PopperPropsCustom) => {
  const contRender = props.content as ContextMenuProps['content'];

  return (
    <div
      onContextMenu={e => e.preventDefault()}
      className={classNames(
        'm78-context-menu',
        (props as any).classNamePassToCustomer,
        (props as any).stylePassToCustomer,
      )}
      onClick={() => props.setShow(false)}
    >
      {isFunction(contRender) ? contRender(props) : contRender}
    </div>
  );
};

const ContextMenu = ({ content, customer, className, style, children }: ContextMenuProps) => {
  const [target, setTarget] = useState<Bound | undefined>();
  const [show, setShow] = useState(false);

  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();

    setTarget({
      left: e.clientX,
      top: e.clientY,
      right: e.clientX,
      bottom: e.clientY,
    });

    !show && setShow(true);

    return false;
  }

  return (
    <>
      <Popper
        show={show}
        type="popper"
        target={target}
        trigger="subClick"
        direction={PopperDirectionEnum.rightStart}
        offset={0}
        content={content}
        customer={customer || MenuCustomer}
        onChange={setShow}
        // @ts-ignore 组件内部临时增加的属性
        classNamePassToCustomer={className}
        // @ts-ignore
        stylePassToCustomer={style}
      />
      {React.cloneElement(children, {
        onContextMenu,
      })}
    </>
  );
};

const ContextMenuItem = (props: ContextMenuItemProps) => {
  return (
    <Tile
      {...props}
      className={classNames(
        'm78-context-menu_item',
        props.className,
        props.disabled && '__disabled',
      )}
    />
  );
};

ContextMenu.Item = ContextMenuItem;

export default ContextMenu;
export { ContextMenuItem };
