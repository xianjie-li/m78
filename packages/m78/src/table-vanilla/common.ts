export function _removeNode(node: Node) {
  node.parentNode?.removeChild(node);
}
