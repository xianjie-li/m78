import 'm78/auth/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import React, { useEffect } from 'react';
import createApi from '@lxjx/auth';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { useSetState, useSelf, useFn, useEffectEqual } from '@lxjx/hooks';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import Spin from 'm78/spin';
import Button from 'm78/button';
import Result from 'm78/result';
import Popper from 'm78/popper';

function createAuth(auth) {
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

    var _useSetState = useSetState({
      pending: true,
      rejects: null
    }),
        _useSetState2 = _slicedToArray(_useSetState, 2),
        state = _useSetState2[0],
        setState = _useSetState2[1];

    var self = useSelf({
      /** 在实际进行验证前阻止渲染 */
      flag: true
    });
    var loading = useDelayDerivedToggleStatus(state.pending);
    var authHandler = useFn(function () {
      if (disabled) return;
      !state.pending && setState({
        pending: true
      });
      self.flag = false;
      auth.auth(keys, {
        extra: extra,
        validators: validators
      }).then(function (rejects) {
        setState({
          rejects: rejects
        });
      })["finally"](function () {
        setState({
          pending: false
        });
      });
    });
    useEffectEqual(authHandler, [keys, extra]);
    useEffect(function () {
      return auth.subscribe(authHandler);
    }, []);
    if (disabled) return children;
    if (self.flag) return null;

    if (loading) {
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
        }, /*#__PURE__*/React.cloneElement(children, {
          onClick: undefined
        }));
      }
    }

    return children;
  };

  AuthComponent.displayName = 'FrAuth';
  return AuthComponent;
}

var create = function create(config) {
  var auth = createApi(config);
  var Auth = createAuth(auth);

  var withAuth = function withAuth(conf) {
    return function (Component) {
      var displayName = Component.displayName || Component.name || 'Component';

      var EnhanceComponent = function EnhanceComponent(props) {
        return /*#__PURE__*/React.createElement(Auth, conf, /*#__PURE__*/React.createElement(Component, props));
      };

      EnhanceComponent.displayName = "withAuth(".concat(displayName, ")");
      return EnhanceComponent;
    };
  };

  return _objectSpread(_objectSpread({}, auth), {}, {
    Auth: Auth,
    withAuth: withAuth
  });
};

export default create;
