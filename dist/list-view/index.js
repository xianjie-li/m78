import 'm78/list-view/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { createContext, useContext } from 'react';
import { Tile } from 'm78/layout';
import { Ellipsis } from 'm78/ellipsis';
import { RightOutlined } from '@ant-design/icons';
import classNames from 'clsx';

var ListViewItemStyleEnum;

(function (ListViewItemStyleEnum) {
  ListViewItemStyleEnum["splitLine"] = "splitLine";
  ListViewItemStyleEnum["border"] = "border";
  ListViewItemStyleEnum["none"] = "none";
})(ListViewItemStyleEnum || (ListViewItemStyleEnum = {}));

var context = /*#__PURE__*/createContext({});

var Provider = context.Provider;

function InternalListView(props) {
  var children = props.children,
      border = props.border,
      size = props.size,
      _props$effect = props.effect,
      effect = _props$effect === void 0 ? true : _props$effect,
      column = props.column,
      _props$itemStyle = props.itemStyle,
      itemStyle = _props$itemStyle === void 0 ? ListViewItemStyleEnum : _props$itemStyle,
      className = props.className,
      style = props.style;
  var hasColumn = column && column > 1;
  var isBorderItem = itemStyle === ListViewItemStyleEnum.border;
  var isSplitItem = itemStyle === ListViewItemStyleEnum.splitLine;
  return /*#__PURE__*/React.createElement(Provider, {
    value: props
  }, /*#__PURE__*/React.createElement("div", {
    className: classNames('m78-list-view', className, size && "__".concat(size), {
      __border: border,
      __effect: effect,
      '__item-border': isBorderItem,
      '__split-line': isSplitItem && !hasColumn,
      __column: hasColumn
    }),
    style: style
  }, children));
}

function InternalListViewItem(_ref) {
  var title = _ref.title,
      desc = _ref.desc,
      leading = _ref.leading,
      trailing = _ref.trailing,
      arrow = _ref.arrow,
      _ref$crossAlign = _ref.crossAlign,
      crossAlign = _ref$crossAlign === void 0 ? 'center' : _ref$crossAlign,
      _ref$titleEllipsis = _ref.titleEllipsis,
      titleEllipsis = _ref$titleEllipsis === void 0 ? 1 : _ref$titleEllipsis,
      _ref$descEllipsis = _ref.descEllipsis,
      descEllipsis = _ref$descEllipsis === void 0 ? 2 : _ref$descEllipsis,
      disabled = _ref.disabled,
      className = _ref.className,
      style = _ref.style,
      innerRef = _ref.innerRef,
      ppp = _objectWithoutProperties(_ref, ["title", "desc", "leading", "trailing", "arrow", "crossAlign", "titleEllipsis", "descEllipsis", "disabled", "className", "style", "innerRef"]);

  var _useContext = useContext(context),
      column = _useContext.column;

  var hasColumn = column && column > 1;
  return /*#__PURE__*/React.createElement(Tile, _extends({
    innerRef: innerRef,
    style: _objectSpread({
      width: hasColumn ? "calc(".concat(100 / column, "% - 8px)") : undefined
    }, style),
    className: classNames('m78-list-view_item', className, disabled && '__disabled'),
    title: titleEllipsis ? /*#__PURE__*/React.createElement(Ellipsis, {
      line: titleEllipsis
    }, title) : title,
    desc: desc && /*#__PURE__*/React.createElement(Ellipsis, {
      line: descEllipsis
    }, desc),
    leading: leading,
    trailing: (trailing || arrow) && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", null, trailing), arrow && /*#__PURE__*/React.createElement(RightOutlined, {
      className: "m78-list-view_item_arrow"
    })),
    crossAlign: crossAlign
  }, ppp));
}

function InternalListViewTitle(_ref2) {
  var subTile = _ref2.subTile,
      children = _ref2.children,
      desc = _ref2.desc;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('m78-list-view_title', subTile && '__sub-title')
  }, /*#__PURE__*/React.createElement("div", null, children), desc && /*#__PURE__*/React.createElement("div", {
    className: "m78-list-view_title-desc"
  }, desc));
}

InternalListView.displayName = 'ListView';
InternalListViewItem.displayName = 'ListViewItem';
InternalListViewTitle.displayName = 'ListViewTitle';

export { InternalListView as ListView, InternalListViewItem as ListViewItem, ListViewItemStyleEnum, InternalListViewTitle as ListViewTitle };
