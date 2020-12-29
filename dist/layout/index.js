import 'm78/layout/style';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import React from 'react';
import cls from 'classnames';
import { isArray } from '@lxjx/utils';
import { AspectRatio as AspectRatio$1, Row as Row$1 } from 'm78/layout';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _extends from '@babel/runtime/helpers/extends';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';

var defaultProps = {
  count: 3,
  children: [],
  aspectRatio: 1,
  border: true,
  borderColor: 'rgba(0, 0, 0, 0.15)'
};

var Grid = function Grid(props) {
  var count = props.count,
      children = props.children,
      cSpacing = props.crossSpacing,
      mSpacing = props.mainSpacing,
      spacing = props.spacing,
      size = props.size,
      aspectRatio = props.aspectRatio,
      _props$complete = props.complete,
      complete = _props$complete === void 0 ? true : _props$complete,
      border = props.border,
      borderColor = props.borderColor,
      className = props.className,
      style = props.style,
      contClassName = props.contClassName,
      contStyle = props.contStyle;
  var child = isArray(children) ? _toConsumableArray(children) : [children];

  var originalChild = _toConsumableArray(child);

  var crossSpacing = cSpacing || spacing;
  var mainSpacing = mSpacing || spacing;
  var spare = originalChild.length % count;
  var width = 100 / count;

  if (complete && spare !== 0 && count - spare > 0) {
    for (var i = 0; i < count - spare; i++) {
      child.push( /*#__PURE__*/React.createElement("div", null));
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-grid', className),
    style: style
  }, child.map(function (item, index) {
    var realIndex = index + 1; // 每行最后一个

    var isLast = realIndex % count === 0; // 每行第一个

    var isFirst = (realIndex - 1) % count === 0; // 第一行

    var firstLine = index < count; // 最后一行

    var lastLine = originalChild.length - realIndex < (spare || count); // 需要添加主轴space的项

    var hasMainSpace = mainSpacing && !isLast; // 除最后一项外主轴每项的间距

    var mainSpace = mainSpacing ? (count - 1) * mainSpacing / count : 0;
    return /*#__PURE__*/React.createElement(size ? 'div' : AspectRatio$1, {
      ratio: aspectRatio,
      key: index,
      style: {
        color: borderColor,
        border: border ? undefined : 'none',
        width: mainSpacing ? "calc(".concat(width, "% - ").concat(mainSpace, "px)") : "".concat(width, "%"),
        height: size || undefined,
        marginBottom: !lastLine && crossSpacing ? crossSpacing : undefined,
        marginRight: hasMainSpace ? mainSpacing : undefined
      },
      className: cls('m78-grid_item', {
        __topBorder: border && (firstLine || crossSpacing),
        __leftBorder: border && (isFirst || mainSpacing)
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: cls('m78-grid_cont', contClassName),
      style: contStyle
    }, item));
  }));
};

Grid.defaultProps = defaultProps;

var AspectRatio = function AspectRatio(_ref) {
  var _ref$ratio = _ref.ratio,
      ratio = _ref$ratio === void 0 ? 1 : _ref$ratio,
      children = _ref.children,
      className = _ref.className,
      style = _ref.style;
  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-aspect-ratio', className),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-aspect-ratio_scaffold",
    style: {
      paddingTop: "".concat(ratio * 100, "%")
    }
  }), children);
};

var Center = function Center(_ref) {
  var children = _ref.children,
      attach = _ref.attach,
      className = _ref.className,
      style = _ref.style;
  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-center', className, style),
    style: _objectSpread({
      position: attach ? 'absolute' : undefined
    }, style)
  }, children);
};

var Divider = function Divider(_ref) {
  var vertical = _ref.vertical,
      width = _ref.width,
      height = _ref.height,
      color = _ref.color,
      _ref$margin = _ref.margin,
      margin = _ref$margin === void 0 ? 12 : _ref$margin;
  var marginStr = vertical ? "0 ".concat(margin, "px") : "".concat(margin, "px 0");
  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-divider', vertical && '__vertical'),
    style: {
      width: width,
      height: height,
      backgroundColor: color,
      margin: marginStr
    }
  });
};

var Spacer = function Spacer(_ref) {
  var width = _ref.width,
      height = _ref.height,
      children = _ref.children;
  var w;
  var h;

  if (width && !height) {
    w = width;
  }

  if (height && !width) {
    h = height;
  }

  if (!h && !w) {
    h = 16;
  }

  if (children && isArray(children)) {
    var child = children.reduce(function (prev, item, ind) {
      prev.push(item);

      if (ind !== children.length - 1) {
        prev.push( /*#__PURE__*/React.createElement(Spacer, {
          key: ind + Math.random(),
          width: width,
          height: height
        }));
      }

      return prev;
    }, []);
    return child;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-spacer', !!w && '__inline'),
    style: {
      width: w,
      height: h
    }
  });
};

/**
 * 传入onClick时, 会附加点击反馈效果
 * */

var Tile = function Tile(_ref) {
  var className = _ref.className,
      title = _ref.title,
      desc = _ref.desc,
      leading = _ref.leading,
      trailing = _ref.trailing,
      crossAlign = _ref.crossAlign,
      ppp = _objectWithoutProperties(_ref, ["className", "title", "desc", "leading", "trailing", "crossAlign"]);

  return /*#__PURE__*/React.createElement(Row$1, _extends({}, ppp, {
    className: cls('m78-tile', className),
    crossAlign: crossAlign
  }), leading && /*#__PURE__*/React.createElement("div", {
    className: "m78-tile_leading"
  }, leading), /*#__PURE__*/React.createElement("div", {
    className: "m78-tile_main"
  }, title && /*#__PURE__*/React.createElement("div", null, title), desc && /*#__PURE__*/React.createElement("div", null, desc)), trailing && /*#__PURE__*/React.createElement("div", {
    className: "m78-tile_trailing"
  }, trailing));
};

function getClasses(mainAlign, crossAlign) {
  var styObj = {};

  if (mainAlign) {
    styObj["m78-main-".concat(mainAlign)] = true;
  }

  if (crossAlign) {
    styObj["m78-cross-".concat(crossAlign)] = true;
  }

  return styObj;
}

var Column = function Column(_ref) {
  var children = _ref.children,
      style = _ref.style,
      className = _ref.className,
      mainAlign = _ref.mainAlign,
      crossAlign = _ref.crossAlign,
      ppp = _objectWithoutProperties(_ref, ["children", "style", "className", "mainAlign", "crossAlign"]);

  return /*#__PURE__*/React.createElement("div", _extends({}, ppp, {
    className: cls('m78-column', className, getClasses(mainAlign, crossAlign)),
    style: style
  }), children);
};

var Row = function Row(_ref2) {
  var children = _ref2.children,
      style = _ref2.style,
      className = _ref2.className,
      mainAlign = _ref2.mainAlign,
      _ref2$crossAlign = _ref2.crossAlign,
      crossAlign = _ref2$crossAlign === void 0 ? 'start' : _ref2$crossAlign,
      ppp = _objectWithoutProperties(_ref2, ["children", "style", "className", "mainAlign", "crossAlign"]);

  return /*#__PURE__*/React.createElement("div", _extends({}, ppp, {
    className: cls('m78-row', className, getClasses(mainAlign, crossAlign)),
    style: style
  }), children);
};

var Flex = function Flex(_ref3) {
  var _ref3$flex = _ref3.flex,
      flex = _ref3$flex === void 0 ? 1 : _ref3$flex,
      children = _ref3.children,
      order = _ref3.order,
      style = _ref3.style,
      className = _ref3.className,
      align = _ref3.align,
      ppp = _objectWithoutProperties(_ref3, ["flex", "children", "order", "style", "className", "align"]);

  return /*#__PURE__*/React.createElement("div", _extends({}, ppp, {
    className: cls(className, align && "m78-self-".concat(align)),
    style: _objectSpread({
      flex: flex,
      order: order
    }, style)
  }), children);
};

export { AspectRatio, Center, Column, Divider, Flex, Grid, Row, Spacer, Tile };
