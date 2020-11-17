import 'm78/fork/style';
import React from 'react';
import Spin from 'm78/spin';
import { isFunction } from '@lxjx/utils';
import Button from 'm78/button';
import NoticeBar from 'm78/notice-bar';
import Empty from 'm78/empty';
import classNames from 'classnames';

var ForkImpl = function ForkImpl(_ref) {
  var children = _ref.children,
      send = _ref.send,
      loading = _ref.loading,
      error = _ref.error,
      timeout = _ref.timeout,
      hasData = _ref.hasData,
      forceRender = _ref.forceRender,
      loadingFull = _ref.loadingFull,
      className = _ref.className,
      style = _ref.style,
      loadingText = _ref.loadingText,
      _ref$emptyText = _ref.emptyText,
      emptyText = _ref$emptyText === void 0 ? '暂无数据' : _ref$emptyText,
      _ref$errorText = _ref.errorText,
      errorText = _ref$errorText === void 0 ? '请求异常' : _ref$errorText,
      _ref$timeoutText = _ref.timeoutText,
      timeoutText = _ref$timeoutText === void 0 ? '请求超时' : _ref$timeoutText,
      customLoading = _ref.customLoading,
      customNotice = _ref.customNotice,
      customEmpty = _ref.customEmpty;

  var renderChild = function renderChild() {
    return isFunction(children) ? children() : children;
  }; // 重试按钮


  var reloadBtn = send ? /*#__PURE__*/React.createElement(Button, {
    onClick: send,
    color: "primary",
    link: true,
    size: "small",
    style: {
      top: -1
      /* 视觉居中 */

    }
  }, "\u91CD\u65B0\u52A0\u8F7D") : null;
  var feedbackNode = renderForks();

  function renderForks() {
    if (loading) {
      return customLoading || /*#__PURE__*/React.createElement(Spin, {
        text: loadingText,
        className: "ptb-12",
        full: loadingFull
      });
    }

    if (error || timeout) {
      var title = timeout ? timeoutText : errorText;
      var msg = (error === null || error === void 0 ? void 0 : error.message) || (typeof error === 'string' ? error : '');
      return customNotice ? customNotice(title, msg) : /*#__PURE__*/React.createElement(NoticeBar, {
        className: "m78-fork_notice",
        status: "error",
        message: title,
        desc: /*#__PURE__*/React.createElement("div", null, msg && /*#__PURE__*/React.createElement("div", {
          className: "color-error mb-8"
        }, msg), /*#__PURE__*/React.createElement("span", null, "\u8BF7\u7A0D\u540E\u91CD\u8BD5", send ? '或' : null, " "), reloadBtn)
      });
    }

    if (!hasData && !loading) {
      return customEmpty || /*#__PURE__*/React.createElement(Empty, {
        desc: emptyText,
        style: {
          padding: 0
        }
      }, reloadBtn);
    }
  }

  function renderFeedback() {
    return /*#__PURE__*/React.createElement("div", {
      className: classNames('m78-fork', className),
      style: style
    }, feedbackNode);
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, (!feedbackNode || forceRender) && renderChild(), feedbackNode && renderFeedback());
};
/* 根据条件渲染或卸载内部的组件 */


var If = function If(_ref2) {
  var when = _ref2.when,
      children = _ref2.children;
  when = !!when;
  var isFuncChild = isFunction(children);
  return when && (isFuncChild ? children() : children);
};
/**
 * 显示或隐藏内容(!必须确保子只有一个子元素并且包含包裹元素（即不能为纯文本），用于挂载display: 'none')
 *  */


var Toggle = function Toggle(_ref3) {
  var when = _ref3.when,
      children = _ref3.children;

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
var Switch = function Switch(_ref4) {
  var children = _ref4.children;
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

var Fork = ForkImpl;
Fork.If = If;
Fork.Toggle = Toggle;
Fork.Switch = Switch;

export default Fork;
export { If, Switch, Toggle };
