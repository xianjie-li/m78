import 'm78/pagination/style';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useMemo, useState } from 'react';
import Button from 'm78/button';
import { LeftOutlined, RightOutlined, EllipsisOutlined, DoubleLeftOutlined, DoubleRightOutlined } from 'm78/icon';
import { Divider } from 'm78/layout';
import Input from 'm78/input';
import cls from 'classnames';
import { useFormState } from '@lxjx/hooks';
import { If } from 'm78/fork';
import _clamp from 'lodash/clamp';
import { dumpFn, isNumber } from '@lxjx/utils';
import { useNoSSR } from 'm78/no-ssr';

var Pagination = function Pagination(props) {
  var _props$total = props.total,
      total = _props$total === void 0 ? 0 : _props$total,
      _props$pageSize = props.pageSize,
      pageSize = _props$pageSize === void 0 ? 10 : _props$pageSize,
      plain = props.plain,
      simple = props.simple,
      disabled = props.disabled,
      size = props.size,
      jumper = props.jumper,
      count = props.count,
      prevText = props.prevText,
      nextText = props.nextText,
      linkPattern = props.linkPattern;
  dumpFn(props.page, props.defaultPage, props.onChange);
  /** 总页数 */

  var totalPage = Math.ceil(total / pageSize);

  var _useFormState = useFormState(props, 1, {
    valueKey: 'page',
    defaultValueKey: 'defaultPage'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      page = _useFormState2[0],
      setPage = _useFormState2[1];

  var noSSR = useNoSSR();
  /** 页码数组 */

  var pageItems = useMemo(getMainItems, [page]);

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      jumpPage = _useState2[0],
      setJumpPage = _useState2[1];
  /**
   * 获取当前页的前两页和后两页，如果某个方向不足，向后方补齐
   * */


  function getMainItems() {
    var _getOverItemLength = getOverItemLength([page - 2, page - 1]),
        _getOverItemLength2 = _slicedToArray(_getOverItemLength, 2),
        prevO = _getOverItemLength2[0],
        pDif = _getOverItemLength2[1];

    var _getOverItemLength3 = getOverItemLength([page + 1, page + 2]),
        _getOverItemLength4 = _slicedToArray(_getOverItemLength3, 2),
        nextO = _getOverItemLength4[0],
        nDif = _getOverItemLength4[1];

    var prev = fillDiff(prevO, nDif, true);
    var next = fillDiff(nextO, pDif);
    return getOverItemLength([].concat(_toConsumableArray(prev), [page], _toConsumableArray(next)))[0];
  }
  /** 从一个数字数组中剔除所有超出页码(闭合区间)的数字，并返回被剔除的数量 */


  function getOverItemLength(arr) {
    var res = arr.filter(function (p) {
      return p > 1 && p < totalPage;
    });
    return [res, arr.length - res.length];
  }
  /**
   * 接收数字数组，并根据isPrev和diffNumber往他的前或后添加diffNumber数量的递增/递减数字
   * @param arr - 原数组
   * @param diffNumber - 要添加的长度
   * @param isPrev - 如果为true，则往前添加
   * @return - 处理后的新数组，经过getOverItemLength处理
   * */


  function fillDiff(arr, diffNumber, isPrev) {
    if (diffNumber === 0 || arr.length === 0
    /* 这里需要特殊处理 */
    ) return arr;
    var nextItem = isPrev ? arr[0] : arr[arr.length - 1];

    var fillArr = _toConsumableArray(arr);

    Array.from({
      length: diffNumber
    }).forEach(function (_, ind) {
      if (isPrev) {
        fillArr.unshift(nextItem - (ind + 1));
      } else {
        fillArr.push(nextItem + 1 + ind);
      }
    });
    return getOverItemLength(fillArr)[0];
  }
  /** 跳转至指定页码，如果超出限定页码，会限制为最小/大值 */


  function go(p) {
    if (disabled) return;

    var clampPage = _clamp(p, 1, totalPage);

    setPage(clampPage);
  }
  /** 根据传入页码生成a链接, 用于linkPattern */


  function injectVar2Link(p) {
    if (!linkPattern) return;
    var map = {
      page: p,
      pageSize: pageSize
    };
    return linkPattern.replace(/{([a-zA-Z]+)}/g, function (mtc, key) {
      return map[key] || mtc;
    });
  }

  function renderItem(item) {
    var isCurrent = item === page;
    return /*#__PURE__*/React.createElement(Button, {
      key: item,
      className: cls('m78-pagination_item', {
        __active: isCurrent
      }),
      color: isCurrent ? 'primary' : undefined,
      link: plain,
      onClick: function onClick() {
        return go(item);
      },
      disabled: disabled,
      title: "\u7B2C".concat(item, "\u9875")
    }, renderLinkOrPageString(item, "\u7B2C".concat(item, "\u9875")));
  }

  function renderPrev() {
    return /*#__PURE__*/React.createElement(Button, {
      className: "m78-pagination_item __prev",
      disabled: page === 1 || disabled,
      link: plain,
      title: "\u4E0A\u4E00\u9875",
      onClick: function onClick() {
        return go(page - 1);
      }
    }, prevText || /*#__PURE__*/React.createElement(LeftOutlined, null));
  }

  function renderNext() {
    return /*#__PURE__*/React.createElement(Button, {
      className: "m78-pagination_item __next",
      disabled: page === totalPage || disabled,
      link: plain,
      title: "\u4E0B\u4E00\u9875",
      onClick: function onClick() {
        return go(page + 1);
      }
    }, nextText || /*#__PURE__*/React.createElement(RightOutlined, null));
  }

  function renderJumper(prefix, affix) {
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-pagination_jumper"
    }, prefix, /*#__PURE__*/React.createElement(Input, {
      size: size,
      type: "integer",
      allowClear: false,
      disabled: disabled,
      value: jumpPage,
      placeholder: simple ? "".concat(page) : undefined,
      onChange: function onChange(val) {
        return setJumpPage(val);
      },
      onSearch: function onSearch(val) {
        setJumpPage('');
        var nPage = Number(val);
        if (isNumber(nPage)) go(nPage);
      }
    }), affix);
  }

  function renderLinkOrPageString(p, title) {
    return linkPattern && !noSSR ? /*#__PURE__*/React.createElement("a", {
      className: "m78-pagination_link",
      href: injectVar2Link(p),
      title: title
    }, p) : p;
  }

  if (simple) {
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-pagination __simple"
    }, renderPrev(), renderJumper(), " / ", /*#__PURE__*/React.createElement("span", {
      className: "m78-pagination_simple-total"
    }, totalPage), renderNext());
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-pagination', {
      __plain: plain,
      __small: size === 'small'
    })
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-pagination_main"
  }, renderPrev(), renderItem(1), /*#__PURE__*/React.createElement(If, {
    when: page >= 5
  }, /*#__PURE__*/React.createElement(Button, {
    className: "m78-pagination_item __ellipsis __ellipsisPrev",
    link: true,
    title: "\u524D\u7FFB5\u9875",
    disabled: disabled,
    onClick: function onClick() {
      return go(page - 5);
    }
  }, /*#__PURE__*/React.createElement(EllipsisOutlined, null), /*#__PURE__*/React.createElement(DoubleLeftOutlined, null))), pageItems.map(renderItem), /*#__PURE__*/React.createElement(If, {
    when: page <= totalPage - 4
  }, /*#__PURE__*/React.createElement(Button, {
    className: "m78-pagination_item __ellipsis __ellipsisNext",
    link: true,
    title: "\u540E\u7FFB5\u9875",
    onClick: function onClick() {
      return go(page + 5);
    },
    disabled: disabled
  }, /*#__PURE__*/React.createElement(EllipsisOutlined, null), /*#__PURE__*/React.createElement(DoubleRightOutlined, null))), totalPage > 0 && renderItem(totalPage), renderNext()), jumper && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, {
    vertical: true
  }), renderJumper('跳至', '页')), count && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, {
    vertical: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "m78-pagination_count"
  }, "\u5171 ", /*#__PURE__*/React.createElement("span", {
    className: "color-primary"
  }, total), " \u6761\u6570\u636E")));
};

export default Pagination;
