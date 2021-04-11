import 'm78/skeleton/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useMemo } from 'react';
import cls from 'classnames';

/* 获取一个以baseP为基础值的百分比宽度 */
function getRandWidth(baseP) {
  var rand = getRand(0, 80);
  return "".concat(rand + baseP, "%");
}
/* 获取值区间 */


function getRand(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

var _Skeleton = function _Skeleton(_ref) {
  var width = _ref.width,
      _ref$lineNumber = _ref.lineNumber,
      lineNumber = _ref$lineNumber === void 0 ? 6 : _ref$lineNumber,
      _ref$shadow = _ref.shadow,
      shadow = _ref$shadow === void 0 ? true : _ref$shadow,
      circle = _ref.circle,
      img = _ref.img;

  /* 渲染行 */
  function renderLineBox() {
    var number = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;

    /* 行的数量计算规则: */

    /* 存在img时必须大于等于4，否则无限制 */
    var lineNum = img && lineNumber < 4 ? 4 : number;
    return Array.from({
      length: lineNum
    }).map(function (val, ind) {
      // 只在行数大于1时才减少列数量
      var last = lineNum > 1 && ind === lineNum - 1;
      return /*#__PURE__*/React.createElement("div", {
        key: ind,
        className: "m78-skeleton_line-box"
      }, Array.from({
        length: last ? 3 : 5
      }).map(function (v, i) {
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          className: "m78-skeleton_line m78-skeleton_animate",
          style: {
            width: last ? "".concat(getRand(8, 36), "%") : getRandWidth(10)
          }
        });
      }));
    });
  }
  /* 防止重绘 */

  /* eslint-disable-next-line */


  var lines = useMemo(function () {
    return renderLineBox(lineNumber);
  }, [lineNumber]);
  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-skeleton', {
      __shadow: shadow
    }),
    style: {
      width: width
    }
  }, img && /*#__PURE__*/React.createElement("div", {
    className: cls('m78-skeleton_img', {
      __circle: !!circle
    })
  }), lines);
};
/* height属性作用于banner的高度 */


var _Banner = function _Banner(_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      _ref2$shadow = _ref2.shadow,
      shadow = _ref2$shadow === void 0 ? true : _ref2$shadow;
  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-skeleton m78-skeleton_banner', {
      __shadow: shadow
    }),
    style: {
      width: width
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-skeleton_banner-main m78-skeleton_animate",
    style: {
      height: height
    }
  }), /*#__PURE__*/React.createElement(_Skeleton, {
    show: true,
    lineNumber: 2
  }));
};
/** 工厂HOC，为其包裹的骨架组件提供一些基础的props和基本的流程控制 */


function SkeletonFactory(Component) {
  var SkeletonWrap = function SkeletonWrap(_ref3) {
    var _ref3$number = _ref3.number,
        number = _ref3$number === void 0 ? 1 : _ref3$number,
        _ref3$show = _ref3.show,
        show = _ref3$show === void 0 ? true : _ref3$show,
        _ref3$children = _ref3.children,
        children = _ref3$children === void 0 ? null : _ref3$children,
        props = _objectWithoutProperties(_ref3, ["number", "show", "children"]);

    var render = function render() {
      return Array.from({
        length: number
      }).map(function (v, i) {
        return /*#__PURE__*/React.createElement(Component, _extends({
          key: i
        }, props));
      });
    };

    return show ? render() : children;
  };

  return SkeletonWrap;
}

var BasedSkeleton = SkeletonFactory(_Skeleton);
var BannerSkeleton = SkeletonFactory(_Banner);
var Skeleton = Object.assign(BasedSkeleton, {
  BannerSkeleton: BannerSkeleton,
  SkeletonFactory: SkeletonFactory
});

export default Skeleton;
export { BannerSkeleton, SkeletonFactory };
