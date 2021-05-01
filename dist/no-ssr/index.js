import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useState, useLayoutEffect, useEffect } from 'react';

/**
 * 是否是服务端
 * 这是一个伪判断, 因为某些SSR环境会模拟window和document对象, 所以仅仅是提高判断层次来增加正确命中率
 * - 即使判断失效了，在提供了兼容环境的服务端应该也不会有太大影响
 * */
var isBrowser = !(typeof window !== 'undefined' && window.document && window.document.createElement && window.localStorage && window.history && window.location);
var useEffectDiff = isBrowser ? useLayoutEffect : useEffect;
/**
 * 获取一个用于识别并跳过SSR渲染的变量
 * @param force - 开启执行环境监测
 * 这会减少一次render的触发，但是由于执行`hydrate()`时服务端节点和客户端节点不一致，会触发`Warning: Expected server HTML to contain a matching <*> in <*>`警告, 如果对render次数很敏感且不在意开此警告可开启(此警告不会影响生产环境)。
 * @return - 一个用于标识并跳过服务端渲染的变量
 * */

function useNoSSR() {
  var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var _useState = useState(function () {
    return force ? isBrowser : false;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      noSSR = _useState2[0],
      set = _useState2[1];

  useEffectDiff(function () {
    !noSSR && set(true);
  }, []);
  return noSSR;
}
function NoSSR(_ref) {
  var children = _ref.children,
      feedback = _ref.feedback;
  var noSSR = useNoSSR();
  return /*#__PURE__*/React.createElement(React.Fragment, null, noSSR ? children : feedback);
}

export { NoSSR, useNoSSR };
