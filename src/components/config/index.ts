/**
 * ################################
 * 全局性的控制组件的一些表现和行为
 * config本身是一个seed, 可以使用seed的所有api
 * ################################
 * */

import { createSeed } from 'm78/seed';
import React from 'react';

interface M78SeedState {
  /** 黑暗模式 */
  darkMode?: boolean;
  /** empty组件特有配置 */
  empty: {
    /** 全局配置Empty组件的空状态图片 */
    emptyNode?: React.ReactElement;
  };
  picture: {
    /** Picture组件加载图片错误时的默认占位图 */
    errorImg?: string;
  };
}

const m78Config = createSeed<M78SeedState>({
  state: {
    darkMode: false,
    empty: {},
    picture: {},
  },
});

m78Config.subscribe(({ darkMode }) => {
  if (typeof window !== 'undefined' && window.document) {
    document.documentElement.setAttribute('data-mode', darkMode ? 'dark' : 'light');
  }
});

export { m78Config };
