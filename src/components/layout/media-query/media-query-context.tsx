import React, { useRef } from 'react';
import { useFn } from '@lxjx/hooks';
import { _MediaQueryTypeContext } from '../types';
import { mediaQueryCtx } from './context';
import { onChangeHandle } from './common';
import MediaQueryCalc from './media-query-calc';

/**
 * 提供MediaQuery上下文，其内部的MediaQuery会在此上下文中单独管理
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
