import 'm78/auth/style';
export { default as cacheMiddleware } from '@lxjx/auth/cacheMiddleware';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useEffect, useState } from 'react';
import createApi from '@lxjx/auth';
export { Action, Middleware, PromiseBack, ValidMeta, Validator } from '@lxjx/auth';
import { isFunction } from '@lxjx/utils';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { useSetState, useFn, useEffectEqual, useSelf } from '@lxjx/hooks';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import Spin from 'm78/spin';
import Button from 'm78/button';
import Result from 'm78/result';
import Popper from 'm78/popper';

function createDeps(auth, useDeps) {
  var _Deps = function _Deps(_ref) {
    var children = _ref.children;
    var deps = useDeps();

    if (isFunction(children)) {
      return children(deps);
    }

    return null;
  };

  return _Deps;
}

function createUseAuth(auth) {
  var useAuth = function useAuth(keys, config) {
    var _ref = config || {},
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === void 0 ? false : _ref$disabled;

    var _useSetState = useSetState({
      pending: true,
      rejects: null
    }),
        _useSetState2 = _slicedToArray(_useSetState, 2),
        state = _useSetState2[0],
        setState = _useSetState2[1];

    var _pending = useDelayDerivedToggleStatus(state.pending, 100);

    var authHandler = useFn(function () {
      if (disabled) {
        setState({
          pending: false
        });
        return;
      }

      !state.pending && setState({
        pending: true
      });
      auth.auth(keys, config).then(function (rejects) {
        setState({
          rejects: rejects,
          pending: false
        });
      });
    });
    useEffectEqual(function () {
      authHandler();
    }, [keys, config === null || config === void 0 ? void 0 : config.extra]);
    useEffect(function () {
      return auth.subscribe(authHandler);
    }, []);
    return _objectSpread(_objectSpread({}, state), {}, {
      pending: _pending
    });
  };

  return useAuth;
}

function createAuth(auth, useAuth) {
  var AuthComponent = function AuthComponent(props) {
    var children = props.children,
        keys = props.keys,
        extra = props.extra,
        validators = props.validators,
        _props$type = props.type,
        type = _props$type === void 0 ? 'feedback' : _props$type,
        icon = props.icon,
        pendingNode = props.pendingNode,
        disabled = props.disabled,
        feedback = props.feedback;
    var state = useAuth(keys, {
      extra: extra,
      validators: validators,
      disabled: disabled
    });
    var self = useSelf({
      /** 在实际进行验证前阻止渲染 */
      flag: true
    });
    useEffect(function () {
      self.flag = false;
    }, []);

    var renderChild = function renderChild() {
      return isFunction(children) ? children() : children;
    };

    if (disabled) return renderChild();
    if (self.flag) return null;

    if (state.pending) {
      return pendingNode || /*#__PURE__*/React.createElement(Spin, {
        text: "\u9A8C\u8BC1\u4E2D"
      });
    }

    if (state.rejects) {
      var firstRej = state.rejects[0];
      if (!firstRej || type === 'hidden') return null;

      if (feedback) {
        return feedback(firstRej, props);
      }

      var action = firstRej.actions && firstRej.actions.map(function (_ref) {
        var label = _ref.label,
            btnProps = _objectWithoutProperties(_ref, ["label"]);

        return /*#__PURE__*/React.createElement(Button, _extends({
          key: label,
          size: type === 'popper' ? 'small' : undefined
        }, btnProps), label);
      });

      if (type === 'feedback') {
        return /*#__PURE__*/React.createElement(Result, {
          type: "notAuth",
          icon: icon,
          title: firstRej.label,
          desc: firstRej.desc,
          actions: action
        });
      }

      if (type === 'popper') {
        return /*#__PURE__*/React.createElement(Popper, {
          className: "m78-auth_popper",
          type: "popper",
          trigger: "click",
          icon: icon,
          content: /*#__PURE__*/React.createElement(Result, {
            type: "notAuth",
            title: firstRej.label,
            desc: firstRej.desc,
            actions: action
          })
        }, /*#__PURE__*/React.cloneElement(renderChild(), {
          onClick: undefined
        }));
      }
    }

    return renderChild();
  };

  AuthComponent.displayName = 'FrAuth';
  return AuthComponent;
}

function createUseDeps(auth) {
  var defSelector = function defSelector(d) {
    return d;
  };

  var useDeps = function useDeps() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defSelector;
    var equalFn = arguments.length > 1 ? arguments[1] : undefined;
    var select = useFn(function () {
      return selector(auth.getDeps());
    });

    var _useState = useState(select),
        _useState2 = _slicedToArray(_useState, 2),
        deps = _useState2[0],
        setDeps = _useState2[1];

    var handle = useFn(function () {
      var selected = select();

      if (selected !== deps) {
        if (equalFn && equalFn(selected, deps)) return;
        setDeps(selected);
      }
    });
    useEffect(function () {
      return auth.subscribe(handle);
    }, []);
    return deps;
  };

  return useDeps;
}

var create = function create(config) {
  var auth = createApi(config);
  var useAuth = createUseAuth(auth);
  var Auth = createAuth(auth, useAuth);
  var useDeps = createUseDeps(auth);
  var Deps = createDeps(auth, useDeps);

  var withAuth = function withAuth(conf) {
    return function (Component) {
      var displayName = Component.displayName || Component.name || 'Component';

      var EnhanceComponent = function EnhanceComponent(props) {
        return /*#__PURE__*/React.createElement(Auth, conf, function () {
          return /*#__PURE__*/React.createElement(Component, props);
        });
      };

      EnhanceComponent.displayName = "withAuth(".concat(displayName, ")");
      return EnhanceComponent;
    };
  };

  return _objectSpread(_objectSpread({}, auth), {}, {
    Auth: Auth,
    withAuth: withAuth,
    useAuth: useAuth,
    useDeps: useDeps,
    Deps: Deps
  });
};

var AuthTypeEnum;

(function (AuthTypeEnum) {
  AuthTypeEnum["feedback"] = "feedback";
  AuthTypeEnum["hidden"] = "hidden";
  AuthTypeEnum["popper"] = "popper";
})(AuthTypeEnum || (AuthTypeEnum = {}));

export default create;
export { AuthTypeEnum };
