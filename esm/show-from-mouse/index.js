import '@lxjx/fr/esm/show-from-mouse/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useEffect } from 'react';
import { useSpring, config, animated, interpolate } from 'react-spring';
import { useSelf } from '@lxjx/hooks';
import Mask from '@lxjx/fr/esm/mask';
import { stopPropagation } from '@lxjx/fr/esm/util';
import cls from 'classnames';

/**
 * 实现与Mask组件完全相同，区别是它的内容区域会从鼠标点击区域开始进入和离开并且固定显示于页面中间
 * 作为base模块的依赖，使用此组件必须引入base模块
 * */
var ShowFromMouse = function ShowFromMouse(_ref) {
  var children = _ref.children,
      className = _ref.className,
      contClassName = _ref.contClassName,
      contStyle = _ref.contStyle,
      props = _objectWithoutProperties(_ref, ["children", "className", "contClassName", "contStyle"]);

  var show = props.show;
  var self = useSelf({
    x: 0,
    y: 0
  });

  var _useSpring = useSpring(function () {
    return {
      x: 0,
      y: 0,
      scale: 0
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      sp = _useSpring2[0],
      set = _useSpring2[1];
  /* 处理内容区域动画 */


  useEffect(function () {
    if (show) {
      self.x = window.FR_LAST_CLICK_POSITION_X || 0;
      self.y = window.FR_LAST_CLICK_POSITION_Y || 0;
      set({
        to: function () {
          var _to = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(next) {
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return next({
                      x: self.x,
                      y: self.y,
                      scale: 0,
                      immediate: true,
                      reset: true
                    });

                  case 2:
                    _context.next = 4;
                    return next({
                      x: 0,
                      y: 0,
                      scale: 1,
                      immediate: false,
                      config: config.stiff,
                      reset: false
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          function to(_x) {
            return _to.apply(this, arguments);
          }

          return to;
        }()
      });
    } else {
      set({
        x: self.x,
        y: self.y,
        scale: 0,
        immediate: false,
        config: config.stiff,
        reset: false
      });
      self.x = 0;
      self.y = 0;
    } // eslint-disable-next-line

  }, [show]);
  return /*#__PURE__*/React.createElement(Mask, _extends({
    className: cls('fr-sfm', className)
  }, props), /*#__PURE__*/React.createElement(animated.div, _extends({
    className: cls(contClassName, 'fr-sfm_cont'),
    style: _objectSpread({
      transform: interpolate( //  @ts-ignore
      [sp.x, sp.y, sp.scale], function (x, y, scale) {
        return "translate3d(".concat(x, "px,").concat(y, "px, 0px) scale3d(").concat(scale, ",").concat(scale, ",").concat(scale, ")");
      }),
      opacity: sp.scale
    }, contStyle)
  }, stopPropagation), children));
};
/** 保存鼠标最后点击相对中心点的偏移位置 */


function windowClickHandle(e) {
  var x = e.x || e.screenX; // screenX会有导航栏高度的偏移

  var y = e.y || e.screenY; // 页面中心点

  var winHalfH = window.innerHeight / 2;
  var winHalfW = window.innerWidth / 2;
  window.FR_LAST_CLICK_POSITION_X = x - winHalfW;
  window.FR_LAST_CLICK_POSITION_Y = y - winHalfH;
}
/**
 * 在组件内记忆位置会导致以api形式调用时组件未装载从而无法获得鼠标位置，故将记忆位置的逻辑放到Base中, 也可以减少事件绑定
 * 如果不提前调用此方法，ShowFromMouse永远都只会从页面中心出现
 * */


function registerPositionSave() {
  window.removeEventListener('click', windowClickHandle, true); // 启用事件捕获防止某个元素事件冒泡导致事件不触发

  window.addEventListener('click', windowClickHandle, true);
}

export default ShowFromMouse;
export { registerPositionSave };
