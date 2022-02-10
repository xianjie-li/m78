/**
 * 此模块在任意包执行前执行, 可用于加载基础样式, 预设行为等
 * */

import 'm78/common/style';

/* 点击效果 */
import ClickEffect from '@lxjx/click-effect';

new ClickEffect({
  effect: 'm78-effect',
});

export default 'M78';