import 'm78/seed/style';
export { default as cacheMiddleware } from '@m78/seed/cacheMiddleware';
export { default as devtoolMiddleware } from '@m78/seed/devtoolMiddleware';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useState, useEffect } from 'react';
import createApi__default from '@m78/seed';
export * from '@m78/seed';
import { isFunction } from '@lxjx/utils';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { useFn, useEffectEqual } from '@lxjx/hooks';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import Button from 'm78/button';
import Result from 'm78/result';
import Popper from 'm78/popper';

function createState(seed, useState) {
  var _Deps = function _Deps(_ref) {
    var children = _ref.children;
    var state = useState();

    if (isFunction(children)) {
      return children(state);
    }

    return null;
  };

  return _Deps;
}

function createUseAuth(seed) {
  var useAuth = function useAuth(keys, config) {
    var _ref = config || {},
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === void 0 ? false : _ref$disabled;

    var authHandler = useFn(function () {
      if (disabled) {
        return null;
      }

      return seed.auth(keys, config);
    });

    var _useState = useState(authHandler),
        _useState2 = _slicedToArray(_useState, 2),
        rejects = _useState2[0],
        setRejects = _useState2[1];

    var update = useFn(function () {
      var rej = authHandler();

      if (rej !== rejects) {
        setRejects(rej);
      }
    });
    useEffectEqual(function () {
      return update();
    }, [keys, config === null || config === void 0 ? void 0 : config.extra]);
    useEffect(function () {
      return seed.subscribe(function () {
        return update();
      });
    }, []);
    return rejects;
  };

  return useAuth;
}

/** 扩展seed api */

/** 扩展seed create api */
var AuthTypeEnum;

(function (AuthTypeEnum) {
  AuthTypeEnum["feedback"] = "feedback";
  AuthTypeEnum["hidden"] = "hidden";
  AuthTypeEnum["popper"] = "popper";
})(AuthTypeEnum || (AuthTypeEnum = {}));

function createAuth(seed, useAuth) {
  var AuthComponent = function AuthComponent(props) {
    var children = props.children,
        keys = props.keys,
        extra = props.extra,
        validators = props.validators,
        _props$type = props.type,
        type = _props$type === void 0 ? 'feedback' : _props$type,
        icon = props.icon,
        disabled = props.disabled,
        feedback = props.feedback;
    var rejects = useAuth(keys, {
      extra: extra,
      validators: validators,
      disabled: disabled
    });

    var renderChild = function renderChild() {
      return isFunction(children) ? children() : children;
    };

    if (disabled) return renderChild();

    if (rejects && rejects.length) {
      var firstRej = rejects[0];
      if (type === AuthTypeEnum.hidden) return null;

      if (feedback) {
        return feedback(firstRej, props);
      }

      var action = firstRej.actions && firstRej.actions.map(function (_ref) {
        var label = _ref.label,
            btnProps = _objectWithoutProperties(_ref, ["label"]);

        return /*#__PURE__*/React.createElement(Button, _extends({
          key: label,
          size: type === AuthTypeEnum.popper ? 'small' : undefined
        }, btnProps), label);
      });

      if (type === AuthTypeEnum.feedback) {
        return /*#__PURE__*/React.createElement(Result, {
          type: "notAuth",
          icon: icon,
          title: firstRej.label,
          desc: firstRej.desc,
          actions: action
        });
      }

      if (type === AuthTypeEnum.popper) {
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

  AuthComponent.displayName = 'Auth';
  return AuthComponent;
}

function createUseState(seed) {
  var defSelector = function defSelector(d) {
    return d;
  };

  var _useState = function _useState() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defSelector;
    var equalFn = arguments.length > 1 ? arguments[1] : undefined;
    var select = useFn(function () {
      return selector(seed.getState());
    });

    var _useState2 = useState(select),
        _useState3 = _slicedToArray(_useState2, 2),
        deps = _useState3[0],
        setDeps = _useState3[1];

    var handle = useFn(function () {
      var selected = select();

      if (selected !== deps) {
        if (equalFn && equalFn(selected, deps)) return;
        setDeps(selected);
      }
    });
    useEffect(function () {
      return seed.subscribe(handle);
    }, []);
    return deps;
  };

  return _useState;
}

var create = function create(config) {
  var auth = createApi__default(config);
  var useAuth = createUseAuth(auth);
  var Auth = createAuth(auth, useAuth);
  var useState = createUseState(auth);
  var State = createState(auth, useState);

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
    useState: useState,
    State: State
  });
};

export default create;
export { AuthTypeEnum };
