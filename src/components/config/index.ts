import React, { useContext } from 'react';

export interface FrConfig {
  /** empty组件的空状态图片 */
  emptyNode?: React.ReactElement;
  /** Picture组件加载图片错误时的默认占位图 */
  pictureErrorImg?: string;
}

const context = React.createContext<FrConfig>({});

function useConfig() {
  return useContext(context);
}

export default {
  context,
  Provider: context.Provider,
  Consumer: context.Consumer,
  useConfig,
};
