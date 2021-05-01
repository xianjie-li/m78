import 'm78/error-boundary/style';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _createSuper from '@babel/runtime/helpers/createSuper';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import React from 'react';
import { isFunction } from '@lxjx/utils';
import cls from 'clsx';
import { Spin } from 'm78/spin';
import { Result } from 'm78/result';
import { Button } from 'm78/button';

var ErrorBoundaryType;

(function (ErrorBoundaryType) {
  ErrorBoundaryType["simple"] = "simple";
  ErrorBoundaryType["full"] = "full";
})(ErrorBoundaryType || (ErrorBoundaryType = {}));

var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary() {
    var _location;

    var _this;

    _classCallCheck(this, ErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: null,
      loading: false,
      hasError: false,
      hasLocation: typeof location !== 'undefined' && isFunction((_location = location) === null || _location === void 0 ? void 0 : _location.reload)
    });

    _defineProperty(_assertThisInitialized(_this), "reset", function () {
      _this.setState({
        loading: true
      }); // 模拟一个延迟, 否则错误组件响应过快会导致用户以为自己的点击没有生效


      setTimeout(function () {
        _this.setState({
          error: null,
          hasError: false,
          loading: false
        });
      }, 500);
    });

    _defineProperty(_assertThisInitialized(_this), "reload", function () {
      location.reload();
    });

    return _this;
  }

  _createClass(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      var _this$props$onError, _this$props;

      this.setState({
        error: error
      });
      (_this$props$onError = (_this$props = this.props).onError) === null || _this$props$onError === void 0 ? void 0 : _this$props$onError.call(_this$props, error, errorInfo);

      if (process.env.NODE_ENV === 'production') {
        console.warn('ErrorBoundary:error ->', error);
        console.warn('ErrorBoundary:info ->', errorInfo);
      }
    }
  }, {
    key: "renderWrap",
    value: function renderWrap(child) {
      return /*#__PURE__*/React.createElement("div", {
        className: cls('m78-error-boundary', this.props.className),
        style: this.props.style
      }, child);
    }
  }, {
    key: "renderErrorNode",
    value: function renderErrorNode() {
      var _this$state = this.state,
          error = _this$state.error,
          hasLocation = _this$state.hasLocation;
      var _this$props2 = this.props,
          customer = _this$props2.customer,
          type = _this$props2.type,
          stack = _this$props2.stack;

      if (customer) {
        return customer({
          error: error,
          reload: this.reload,
          reset: this.reset
        });
      }

      if (type === ErrorBoundaryType.full) {
        return this.renderWrap( /*#__PURE__*/React.createElement(Result, {
          type: "error",
          title: error === null || error === void 0 ? void 0 : error.message,
          desc: "\uD83D\uDE2D \u52A0\u8F7D\u6570\u636E\u65F6\u53D1\u751F\u4E86\u4E00\u4E9B\u9519\u8BEF",
          actions: /*#__PURE__*/React.createElement(React.Fragment, null, hasLocation && /*#__PURE__*/React.createElement(Button, {
            onClick: this.reload
          }, "\u5237\u65B0\u9875\u9762"), /*#__PURE__*/React.createElement(Button, {
            onClick: this.reset,
            color: "primary"
          }, "\u91CD\u65B0\u52A0\u8F7D"))
        }, stack && (error === null || error === void 0 ? void 0 : error.stack) ? /*#__PURE__*/React.createElement("pre", {
          className: "m78-error-boundary_pre m78-scrollbar"
        }, error === null || error === void 0 ? void 0 : error.stack) : null));
      }

      return this.renderWrap( /*#__PURE__*/React.createElement(React.Fragment, null, error && error.message && /*#__PURE__*/React.createElement("div", {
        className: "m78-error-boundary_title"
      }, error.message), /*#__PURE__*/React.createElement("div", null, "\uD83D\uDE2D \u53D1\u751F\u4E86\u4E00\u4E9B\u9519\u8BEF\uFF0C\u8BF7\u5C1D\u8BD5", /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("a", {
        onClick: this.reset
      }, " \u91CD\u65B0\u52A0\u8F7D "), ' ', this.state.hasLocation && /*#__PURE__*/React.createElement("span", null, "\u6216", /*#__PURE__*/React.createElement("a", {
        onClick: this.reload
      }, " \u5237\u65B0\u9875\u9762 "))))));
    }
  }, {
    key: "render",
    value: function render() {
      var loading = this.state.loading;
      var customLoadingNode = this.props.customLoadingNode;

      if (loading) {
        return customLoadingNode || this.renderWrap( /*#__PURE__*/React.createElement(Spin, {
          text: "\u91CD\u8F7D\u4E2D",
          inline: true,
          size: "small"
        }));
      }

      if (this.state.hasError) {
        return this.renderErrorNode();
      }

      return this.props.children;
    }
  }], [{
    key: "getDerivedStateFromError",
    value: function getDerivedStateFromError() {
      return {
        hasError: true
      };
    }
  }]);

  return ErrorBoundary;
}(React.Component);

export { ErrorBoundary };
