import React, { useContext } from 'react';

export interface FrConfig {
  /** 全局配置empty组件的空状态图片 */
  emptyNode?: React.ReactElement;
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
