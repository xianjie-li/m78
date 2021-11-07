import { createContext } from 'react';
import { _MediaQueryTypeContext } from '../types';
import { onChangeHandle } from './common';

export const defaultContext: _MediaQueryTypeContext = {
  onChange: size => onChangeHandle(size, defaultContext),
  changeListeners: [],
  meta: null,
  isRoot: true,
};

export const mediaQueryCtx = createContext<_MediaQueryTypeContext>(defaultContext);
