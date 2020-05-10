import React from 'react';
import { PopperProps } from './types';

function Tooltip(props: PopperProps) {
  const { content } = props;

  return <div className="fr-popper_content fr-popper_popper">{content}</div>;
}

function Popper(props: PopperProps) {
  const { content } = props;

  return (
    <div className="fr-popper_content fr-popper_popper">
      <div className="fr-popper_popper_title">标题</div>
      <div className="fr-popper_popper_content">{content}</div>
    </div>
  );
}

export const buildInComponent = {
  tooltip: Tooltip,
  popper: Popper,
};
