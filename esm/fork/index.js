import React from 'react';
import { isFunction } from '@lxjx/utils';

var Fork = function Fork() {
  return null;
};
/* 根据条件渲染或卸载内部的组件 */


var If = function If(_ref) {
  var when = _ref.when,
      children = _ref.children;
  when = !!when;
  var isFuncChild = isFunction(children);
  return when && (isFuncChild ? children() : children);
};
/**
 * 显示或隐藏内容(!必须确保子只有一个子元素并且包含包裹元素（即不能为纯文本），用于挂载display: 'none')
 *  */


var Toggle = function Toggle(_ref2) {
  var when = _ref2.when,
      children = _ref2.children;

  function hideChild() {
    return /*#__PURE__*/React.cloneElement(children, {
      style: {
        display: 'none'
      }
    });
  }

  return when ? children : hideChild();
};

/* 搭配If或Toggle使用，类似react-router的Switch，只渲染内部的第一个prop.when为true的If，当没有任何一个If的when为true时，匹配第一个不包含when的If */
var Switch = function Switch(_ref3) {
  var children = _ref3.children;
  var arrChild = React.Children.toArray(children);
  /* 过滤出第一个when匹配的If和没有prop.when的If */

  var filter = arrChild.reduce(function (prev, child) {
    if (!(child.type === If || child.type === Toggle)) {
      return prev;
    }

    var hasWhen = ('when' in child.props);
    var show = !!child.props.when;

    if (!hasWhen && !prev.notWhen) {
      prev.notWhen = /*#__PURE__*/React.cloneElement(child, {
        when: true
      });
    }

    if (show && !prev.showEl) {
      prev.showEl = child;
    }

    return prev;
  }, {
    showEl: null,
    notWhen: null
  });
  /* 筛选规则: 第一个匹配到when的子If，没有任何when匹配取第一个notWhen, 都没有则返回null */

  return filter.showEl || filter.notWhen || null;
};

var Fork$1 = Fork;
Fork$1.If = If;
Fork$1.Toggle = Toggle;
Fork$1.Switch = Switch;

export default Fork$1;
export { If, Switch, Toggle };
