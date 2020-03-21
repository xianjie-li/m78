import React from 'react';
import ReactDom from 'react-dom';

import { getPortalsNode } from '@lxjx/utils';

const Portal: React.FC<{ namespace?: string }> = ({ children, namespace }) =>
  ReactDom.createPortal(children, getPortalsNode(namespace));

export default Portal;
