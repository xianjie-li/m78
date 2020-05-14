import React from 'react';
import Icon from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/es/components/AntdIcon';
import * as BuiltIns from './built-ins';

export const EmptyIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.Empty} {...(props as any)} />
);

export const SuccessIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.Success} {...(props as any)} />
);

export const WarningIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.Warning} {...(props as any)} />
);

export const ErrorIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.Error} {...(props as any)} />
);

export const NotAuthIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.NotAuth} {...(props as any)} />
);

export const NotFoundIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.NotFound} {...(props as any)} />
);

export const ServerErrorIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.ServerError} {...(props as any)} />
);

export const WindmillIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.Windmill} {...(props as any)} />
);

export const WaitingIcon = (props: AntdIconProps) => (
  <Icon component={BuiltIns.Waiting} {...(props as any)} />
);
