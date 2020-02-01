import './style';
import InternalIcon, { SvgIcon } from './icon';

type IconType = typeof InternalIcon;

interface Icon extends IconType {
  SvgIcon: typeof SvgIcon;
}

const Icon: Icon = InternalIcon as Icon;

Icon.SvgIcon = SvgIcon;

export * from './type';
export * from './iconMap';
export default Icon;
