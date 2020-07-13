import ReactDom from 'react-dom';
import { getPortalsNode } from '@lxjx/utils';

var Portal = function Portal(_ref) {
  var children = _ref.children,
      namespace = _ref.namespace;
  return /*#__PURE__*/ReactDom.createPortal(children, getPortalsNode(namespace));
};

export default Portal;
