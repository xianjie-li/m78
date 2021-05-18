import React, { useRef } from 'react';
import { useFn } from '@lxjx/hooks';
import { _MediaQueryTypeContext } from '../types';
import { mediaQueryCtx } from './context';
import { onChangeHandle } from './common';
import MediaQueryCalc from './media-query-calc';

/**
 * 提供MediaQuery上下文，只有其内部的MediaQuery系列组件会生效
 * */
const MediaQueryContext: React.FC = ({ children }) => {
  const value = useRef<_MediaQueryTypeContext>({
    onChange: () => {},
    changeListeners: [],
    meta: null,
  });

  value.current.onChange = useFn<_MediaQueryTypeContext['onChange']>(size =>
    onChangeHandle(size, value.current),
  );

  return (
    <mediaQueryCtx.Provider value={value.current}>
      {children}
      <MediaQueryCalc />
    </mediaQueryCtx.Provider>
  );
};

export default MediaQueryContext;
