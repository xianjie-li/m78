import React from 'react';

import cls from 'classnames';

import { ListTitleType, ListSubTitleType } from './type';

const Title: React.FC<ListTitleType> = ({ title, desc, className, ...props }) => (
  <h2 className={cls('fr-list_main-title', className)} {...props}>
    <div className="fr-list_main-title-primary">{title}</div>
    <div className="fr-list_main-title-second">{desc}</div>
  </h2>
);

const SubTitle: React.FC<ListSubTitleType> = ({ title, className, ...props }) => (
  <h3 className={cls('fr-list_sub-title', className)} {...props}>
    {title}
  </h3>
);

export { Title, SubTitle };
