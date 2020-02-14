import '@lxjx/flicker/lib/icon/style';
import InternalIcon, { SvgIcon } from './icon';

type InternalIconType = typeof InternalIcon;

interface Icon extends InternalIconType {
  SvgIcon: typeof SvgIcon;
}

const Icon: Icon = Object.assign(InternalIcon, { SvgIcon });

export * from './type';
export * from './iconMap';
export default Icon;
