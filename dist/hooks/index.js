import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { useState, useEffect } from 'react';
import { useSelf } from '@lxjx/hooks';

/**
 * 将转入的开关状态在指定延迟后转为本地状态并在变更后同步
 * */

function useDelayDerivedToggleStatus(toggle) {
  var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  var options = arguments.length > 2 ? arguments[2] : undefined;

  var _ref = options || {},
      disabled = _ref.disabled,
      _ref$deps = _ref.deps,
      deps = _ref$deps === void 0 ? [] : _ref$deps,
      _ref$extraDelay = _ref.extraDelay,
      extraDelay = _ref$extraDelay === void 0 ? 0 : _ref$extraDelay,
      trailing = _ref.trailing,
      _ref$leading = _ref.leading,
      leading = _ref$leading === void 0 ? true : _ref$leading;

  var isDisabled = !delay || disabled || !trailing && !leading; // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false

  var _useState = useState(isDisabled || !leading ? toggle : false),
      _useState2 = _slicedToArray(_useState, 2),
      innerState = _useState2[0],
      setInnerState = _useState2[1];

  var self = useSelf({
    toggleTimer: null
  });
  useEffect(function () {
    if (isDisabled) {
      return;
    }

    if (toggle && !leading || !toggle && !trailing) {
      toggle !== innerState && setInnerState(toggle);
      return;
    }

    self.toggleTimer = setTimeout(function () {
      setInnerState(toggle);
    }, delay + extraDelay);
    return function () {
      self.toggleTimer && clearTimeout(self.toggleTimer);
    };
  }, [toggle].concat(_toConsumableArray(deps)));
  return isDisabled ? toggle : innerState;
}
/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * monkeySet会在何时的情况下才进行更新，可以在直接调用而不用编写验证代码
 * */

function useMountInterface(init, _ref2) {
  var _ref2$mountOnEnter = _ref2.mountOnEnter,
      mountOnEnter = _ref2$mountOnEnter === void 0 ? true : _ref2$mountOnEnter,
      _ref2$unmountOnExit = _ref2.unmountOnExit,
      unmountOnExit = _ref2$unmountOnExit === void 0 ? false : _ref2$unmountOnExit;

  var _useState3 = useState(function () {
    // mountOnEnter为false时，强制渲染, 否则取init
    if (!mountOnEnter) return true;
    return init;
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      mount = _useState4[0],
      setMount = _useState4[1];

  function monkeySet(isMount) {
    // 需要挂载但未挂载时对其进行挂载
    if (isMount && !mount) {
      setMount(true);
      return;
    } // 需要离场卸载且收到卸载通知且当前已挂载


    if (unmountOnExit && !isMount && mount) {
      setMount(false);
    }
  }

  return [mount, monkeySet];
}

export { useDelayDerivedToggleStatus, useMountInterface };
