import '@lxjx/fr/lib/base/style';

/* 点击效果 */
import ClickEffect from '@lxjx/fr-click-effect';

/* 记录点击位置 */
import { registerPositionSave } from '@lxjx/fr/lib/show-from-mouse';

new ClickEffect();

registerPositionSave();
