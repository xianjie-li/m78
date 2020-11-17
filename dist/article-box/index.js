import 'm78/article-box/style';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React from 'react';
import { useMeasure } from 'react-use';
import { If } from 'm78/fork';
import cls from 'classnames';

/* 行数等于 高度 / 240 (行高) + 基础行 4 */

/* 列数等于 宽度 / 300 */
var ArticleBox = function ArticleBox(_ref) {
  var watermark = _ref.watermark,
      html = _ref.html,
      content = _ref.content,
      style = _ref.style,
      className = _ref.className;

  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      ref = _useMeasure2[0],
      _useMeasure2$ = _useMeasure2[1],
      width = _useMeasure2$.width,
      height = _useMeasure2$.height;

  var row = Math.ceil(height / 240) + 4;
  var col = Math.ceil(width / 300);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: cls('m78-article-box', className),
    style: style
  }, /*#__PURE__*/React.createElement(If, {
    when: html
  }, function () {
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-article-box_html",
      dangerouslySetInnerHTML: {
        __html: html
      }
    });
  }), /*#__PURE__*/React.createElement(If, {
    when: content && !html
  }, /*#__PURE__*/React.createElement("div", null, content)), /*#__PURE__*/React.createElement(If, {
    when: watermark
  }, function () {
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-article-box_watermark"
    }, Array.from({
      length: row
    }).map(function (rowItem, rowKey) {
      return /*#__PURE__*/React.createElement("div", {
        className: "m78-article-box_watermark_item",
        key: rowKey
      }, Array.from({
        length: col
      }).map(function (colItem, colKey) {
        return /*#__PURE__*/React.createElement("span", {
          key: colKey
        }, watermark);
      }));
    }));
  }));
};

export default ArticleBox;
