import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { useState, useEffect } from 'react';
import { useSelf } from '@lxjx/hooks';

/* TODO: 将所有延迟显示、关闭更换为 显示时间未达到delay时，延迟至该时间再关闭 */

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
      extraDelay = _ref$extraDelay === void 0 ? 0 : _ref$extraDelay;

  var _useState = useState(disabled ? toggle : false),
      _useState2 = _slicedToArray(_useState, 2),
      innerState = _useState2[0],
      setInnerState = _useState2[1]; // 默认一定要为false


  var self = useSelf({
    toggleTimer: null
  });
  useEffect(function () {
    if (!delay || disabled) {
      setInnerState(toggle);
      return;
    }

    if (toggle === innerState) {
      return;
    }

    self.toggleTimer = setTimeout(function () {
      setInnerState(toggle);
    }, delay + extraDelay);
    return function () {
      self.toggleTimer && clearTimeout(self.toggleTimer);
    };
  }, [toggle].concat(_toConsumableArray(deps)));
  return innerState;
}

export { useDelayDerivedToggleStatus };
