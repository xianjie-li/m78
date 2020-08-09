import 'm78/base/style';

/* 点击效果 */
import ClickEffect from '@lxjx/fr-click-effect';

/* 记录点击位置 */
import { registerPositionSave } from 'm78/show-from-mouse';

new ClickEffect({
  effect: 'm78-effect',
});

registerPositionSave();

export default 1;
