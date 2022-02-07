import React, { useMemo } from 'react';
import clsx from 'clsx';
import {
  omitApiProps,
  Overlay,
  OverlayApiOmitKeys,
  OverlayInstance,
  transitionConfig,
} from 'm78/overlay';
import { omit, TupleNumber } from '@lxjx/utils';
import { TransitionType } from 'm78/transition';
import { PositionEnum, Z_INDEX_DRAWER } from 'm78/common';
import { upperFirst } from 'lodash';
import createRenderApi from '@m78/render-api';
import { DrawerProps, omitDrawerOverlayProps, DrawerOmitOverlayProps } from './type';

const positionMap = {
  [PositionEnum.top]: [0.5, 0.02] as TupleNumber,
  [PositionEnum.right]: [0.96, 0.5] as TupleNumber,
  [PositionEnum.bottom]: [0.5, 0.96] as TupleNumber,
  [PositionEnum.left]: [0.02, 0.5] as TupleNumber,
};

const defaultProps: Partial<DrawerProps> = {
  position: PositionEnum.bottom,
  namespace: 'DRAWER',
  mask: true,
  zIndex: Z_INDEX_DRAWER,
};

const DrawerBase = (props: DrawerProps) => {
  const { className, position, header, ...other } = props;

  const overlayProps = useMemo(() => {
    return omit<DrawerOmitOverlayProps>(other, omitDrawerOverlayProps as any);
  }, [props]);

  function renderContent() {
    return (
      <>
        {header && <div className="m78-drawer_header">{header}</div>}
        <div className="m78-drawer_content">{props.content}</div>
      </>
    );
  }

  return (
    <Overlay
      {...overlayProps}
      className={clsx('m78 m78-drawer', `__${position}`, className)}
      alignment={positionMap[position!]}
      transitionType={`slide${upperFirst(position)}` as TransitionType}
      content={renderContent()}
      springProps={{
        config: {
          ...transitionConfig,
          ...props.springProps,
        },
      }}
    />
  );
};

DrawerBase.defaultProps = defaultProps;

const api = createRenderApi<Omit<DrawerProps, OverlayApiOmitKeys>, OverlayInstance>({
  component: DrawerBase,
  defaultState: {
    mountOnEnter: true,
    unmountOnExit: true,
  },
  omitState: state => omit(state, omitApiProps as any),
});

const _Drawer = Object.assign(DrawerBase, api);

export { _Drawer };
