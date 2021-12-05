import React, { useMemo } from 'react';

import { Modal } from 'm78/modal';
import { Button } from 'm78/button';
import { CloseOutlined } from 'm78/icon';
import { If } from 'm78/fork';

import _capitalize from 'lodash/capitalize';
import cls from 'clsx';

import { useFormState, useSameState } from '@lxjx/hooks';
import { Z_INDEX_DRAWER } from 'm78/common';
import { DrawerProps } from './type';

const alignmentMap: { [key in NonNullable<DrawerProps['direction']>]: [number, number] } = {
  top: [0, 0],
  right: [1, 0],
  bottom: [0, 1],
  left: [0, 0],
};

const spConfig = { clamp: true };

const Drawer: React.FC<DrawerProps> = props => {
  const {
    closeIcon = false,
    direction = 'bottom',
    fullScreen = false,
    className,
    style,
    children,
    ...otherProps
  } = props;

  /** 代理defaultShow/show/onChange, 实现对应接口 */
  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onChange',
    valueKey: 'show',
  });

  const [___, instances, instanceId] = useSameState('fr_drawer_metas', {
    enable: show,
    meta: {
      direction,
    },
  });

  // 所有方向相同，未启用fullScreen的组件
  const sames = instances.filter(item => item.meta.direction === direction && !fullScreen);

  // 该实例后的实例总数
  const afterInstanceLength = useMemo(() => {
    if (!show || !sames.length) return 0;

    const ind = sames.findIndex(item => item.id === instanceId);

    const after = sames.slice(ind + 1);

    return after.length > 0 ? after.length : 0;
  }, [sames, ___]);

  const capDirection = _capitalize(direction);

  let marginType = 'left';

  if (direction === 'bottom' || direction === 'top') {
    marginType = 'top';
  }

  // 当存在多个drawer时，前一个相对于后一个偏移60px, 不适用于全屏模式
  const offsetStyle =
    !fullScreen && show && afterInstanceLength > 0
      ? {
          [`margin${_capitalize(marginType)}`]:
            direction === 'right' || direction === 'bottom'
              ? -afterInstanceLength * 50
              : afterInstanceLength * 50,
        }
      : {};

  function onClose() {
    setShow(false);
    props.onClose?.();
  }

  function render() {
    return (
      <Modal
        {...otherProps}
        namespace="drawer"
        className={cls(
          'm78-drawer',
          {
            '__full-screen': fullScreen,
          },
          direction && !fullScreen && `__${direction}`,
          className,
        )}
        style={{
          ...style,
          ...offsetStyle,
        }}
        baseZIndex={Z_INDEX_DRAWER}
        show={show}
        onChange={nShow => setShow(nShow)}
        animationType={(`slide${capDirection}` as any) || 'bottom'}
        alignment={alignmentMap[direction]}
        animationConfig={spConfig}
        alpha={false}
      >
        <If when={closeIcon || fullScreen}>
          <div className="m78-drawer_close">
            <Button icon onClick={onClose} size="small">
              <CloseOutlined className="m78-close-icon" />
            </Button>
          </div>
        </If>
        {children}
      </Modal>
    );
  }

  return render();
};

export default Drawer;
