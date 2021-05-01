import { createSeed } from 'm78/seed';
import React from 'react';

interface M78SeedState {
  /** 黑暗模式 */
  darkMode?: boolean;
  /** 全局配置Empty组件的空状态图片 */
  emptyNode?: React.ReactElement;
  /** Picture组件加载图片错误时的默认占位图 */
  pictureErrorImg?: string;
}

const m78Config = createSeed<M78SeedState>({
  state: {
    darkMode: false,
  },
});

m78Config.subscribe(({ darkMode }) => {
  if (typeof window !== 'undefined' && window.document) {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }
});

export { m78Config };
