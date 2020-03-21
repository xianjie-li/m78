import React from 'react';
import { shakeFalsy } from '@lxjx/utils';
import cls from 'classnames';
import { IconProps, SvgIconProps } from './type';

import { iconMap, svgIconMap } from './iconMap';

const Icon: React.FC<IconProps> = ({ className, style, type, size, color, spin, ...props }) => {
  const spread = {
    className: cls(className, iconMap[type], 'fr-icon', spin && 'fr-animated-spin'),
    style: shakeFalsy({
      ...style,
      fontSize: size,
      color,
    }),
  };

  return <i {...props} {...spread} />;
};

const SvgIcon: React.FC<SvgIconProps> = ({ className, style, type, size, spin, ...props }) => {
  const spread = {
    className: cls(className, 'fr-svg-icon', spin && 'fr-animated-spin'),
    style: shakeFalsy({
      ...style,
      fontSize: size,
    }),
  };

  return (
    <svg {...props} {...spread} aria-hidden="true">
      <use xlinkHref={`#${svgIconMap[type]}`} />
    </svg>
  );
};

export { SvgIcon };
export default Icon;
