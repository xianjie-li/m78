import 'm78/tab/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useEffect, useRef } from 'react';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import cls from 'classnames';
import { useSetState, useSelf, useFormState, useScroll } from '@lxjx/hooks';
import { useSpring, animated } from 'react-spring';
import { Position } from 'm78/util';
import Carousel from 'm78/carousel';
import { CaretLeftOutlined, CaretRightOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { isArray, isNumber } from '@lxjx/utils';
import { TabItem as TabItem$1 } from 'm78/tab';

var TabItem = function TabItem(_ref) {
  var children = _ref.children,
      disabled = _ref.disabled,
      value = _ref.value,
      label = _ref.label,
      oProps = _objectWithoutProperties(_ref, ["children", "disabled", "value", "label"]);

  return /*#__PURE__*/React.isValidElement(children) ? /*#__PURE__*/React.cloneElement(children, _objectSpread({}, oProps)) : children;
};

/** 格式化子项，确保其格式为Tab[] */
function formatChild(children) {
  if (!children) return [];
  var list = isArray(children) ? children : [children];
  return list.filter(function (item) {
    return item.type === TabItem$1;
  });
}
/** 从一组ReactElement<TabItemProps>中拿到props组成的数组 */

function getChildProps(children) {
  return children.map(function (item) {
    return item.props;
  });
}

function useMethods(share) {
  var isVertical = share.isVertical,
      self = share.self,
      set = share.set,
      val = share.val,
      setVal = share.setVal,
      carouselRef = share.carouselRef,
      disabled = share.disabled,
      state = share.state,
      setState = share.setState;
  /** 根据索引设置活动线的状态 */

  function refreshItemLine(index) {
    var itemEl = self.tabRefs[index];
    if (!itemEl) return;
    var length = isVertical ? itemEl.offsetHeight : itemEl.offsetWidth;
    var offset = isVertical ? itemEl.offsetTop : itemEl.offsetLeft;
    set({
      length: length,
      offset: offset,
      immediate: self.itemSpringSetCount === 0
    });
    self.itemSpringSetCount++;
  }
  /** 根据当前滚动状态设置滚动内容指示器的状态 */


  function refreshScrollFlag(meta, tabsEl, index) {
    if (!hasScroll(meta)) return;
    var currentEl = tabsEl[index];
    var nextEl = tabsEl[index + 1];
    var prevEl = tabsEl[index - 1];
    if (!currentEl) return;
    if (!nextEl && !prevEl) return;
    var offset;
    var scrollOffset = isVertical ? meta.y : meta.x;

    if (prevEl) {
      // 当前元素上一个元素不可见
      var prevOffset = isVertical ? prevEl.offsetTop : prevEl.offsetLeft;

      if (prevOffset < scrollOffset) {
        offset = prevOffset;
      }
    } else {
      // 处理第一个元素点击
      offset = 0;
    }

    if (nextEl) {
      // 当前元素下一个元素不可见
      var wrapSize = isVertical ? meta.height : meta.width;
      var nextOffset = isVertical ? nextEl.offsetTop : nextEl.offsetLeft;
      var nextSize = isVertical ? nextEl.offsetHeight : nextEl.offsetWidth;

      if (scrollOffset + wrapSize < nextOffset + nextSize) {
        offset = nextOffset + nextSize - wrapSize;
      }
    } else {
      // 处理最后一个元素点击
      offset = isVertical ? meta.yMax : meta.xMax;
    }

    if (!isNumber(offset)) return;
    share.scroller.set(_defineProperty({}, isVertical ? 'y' : 'x', offset));
  }
  /** 检测是否可滚动，接收 UseScrollMeta */


  function hasScroll(meta) {
    var _maxSize = isVertical ? meta.yMax : meta.xMax;

    return !!_maxSize;
  }
  /** tab项点击 */


  function onTabClick(itemProps, index) {
    if (val === index) return;
    if (itemProps.disabled || disabled) return;

    if (self.itemSpringSetCount !== 0) {
      carouselRef.current.goTo(index);
    }

    setVal(index);
  } // 向前或后滚动tab, flag为true时为前滚动


  function scrollPage(flag) {
    var _setScroll;

    var _share$scroller = share.scroller,
        get = _share$scroller.get,
        setScroll = _share$scroller.set;

    var _get = get(),
        width = _get.width,
        height = _get.height;

    var offset = isVertical ? height : width;
    setScroll((_setScroll = {}, _defineProperty(_setScroll, isVertical ? 'y' : 'x', flag ? offset : -offset), _defineProperty(_setScroll, "raise", true), _setScroll));
  }

  function scrollPrev() {
    scrollPage(false);
  }

  function scrollNext() {
    scrollPage(true);
  }

  function onScroll(meta) {
    if (hasScroll(meta)) {
      var nextStart = isVertical ? !meta.touchTop : !meta.touchLeft;
      var nextEnd = isVertical ? !meta.touchBottom : !meta.touchRight;

      if (nextStart !== state.startFlag || nextEnd !== state.endFlag) {
        setState({
          endFlag: nextEnd,
          startFlag: nextStart
        });
      }
    } else if (state.endFlag || state.startFlag) {
      setState({
        endFlag: false,
        startFlag: false
      });
    }
  }

  return {
    refreshItemLine: refreshItemLine,
    refreshScrollFlag: refreshScrollFlag,
    hasScroll: hasScroll,
    onTabClick: onTabClick,
    onScroll: onScroll,
    scrollNext: scrollNext,
    scrollPrev: scrollPrev
  };
}

function useLifeCycle(share, methods, props) {
  var val = share.val,
      scroller = share.scroller,
      child = share.child,
      setState = share.setState; // 更新活动线

  useEffect(function () {
    !props.noActiveLine && methods.refreshItemLine(val);
  }, [val, props.size, props.position, child.length, props.flexible]); // 修正滚动位置

  useEffect(function () {
    var sm = scroller.get();
    if (!scroller.ref.current) return;
    var tabs = scroller.ref.current.querySelectorAll('.m78-tab_tabs-item');
    methods.onScroll(sm);
    methods.refreshScrollFlag(sm, tabs, val);
  }, [val]);
  useEffect(function () {
    if ('ontouchstart' in window) {
      setState({
        hasTouch: true
      });
    }
  }, []);
}

var defaultProps = {
  loop: false
};

var Tab = function Tab(props) {
  var _ref2;

  var _ref = props,
      size = _ref.size,
      position = _ref.position,
      flexible = _ref.flexible,
      children = _ref.children,
      height = _ref.height,
      invisibleHidden = _ref.invisibleHidden,
      invisibleUnmount = _ref.invisibleUnmount,
      disabled = _ref.disabled,
      loop = _ref.loop,
      noActiveLine = _ref.noActiveLine,
      noSplitLine = _ref.noSplitLine,
      className = _ref.className,
      style = _ref.style; // 格式化TabItem列表

  var child = formatChild(children); // 所有item的prop配置

  var childProps = getChildProps(child); // 内部状态

  var _useSetState = useSetState({
    startFlag: false,
    endFlag: false,
    hasTouch: false
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1]; // 是否纵向显示


  var isVertical = position === Position.left || position === Position.right; // 实例状态

  var self = useSelf({
    itemSpringSetCount: 0,
    tabRefs: []
  });
  var carouselRef = useRef(null); // 线条动画

  var _useSpring = useSpring(function () {
    return {
      length: 0,
      offset: 0
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      spProps = _useSpring2[0],
      set = _useSpring2[1]; // 控制tab显示


  var _useFormState = useFormState(props, 0, {
    valueKey: 'index',
    defaultValueKey: 'defaultIndex'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      val = _useFormState2[0],
      setVal = _useFormState2[1];

  var share = {
    isVertical: isVertical,
    self: self,
    state: state,
    setState: setState,
    val: val,
    setVal: setVal,
    set: set,
    carouselRef: carouselRef,
    disabled: disabled,
    scroller: null,
    child: child
  }; // 内部方法

  var methods = useMethods(share);
  var onScroll = methods.onScroll,
      onTabClick = methods.onTabClick; // 控制滚动

  share.scroller = useScroll({
    onScroll: onScroll,
    throttleTime: 50,
    touchOffset: 6
  }); // 挂载各种生命周期

  useLifeCycle(share, methods, props);

  if (!childProps.length) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-tab', size && "__".concat(size), position && "__".concat(position), flexible && '__flexible', noSplitLine && '__noSplitLine', className, '__hasPage', 'm78-scroll-bar'),
    style: style
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-tab_tabs-wrap",
    style: {
      height: isVertical ? height : undefined
    }
  }, /*#__PURE__*/React.createElement(If, {
    when: !state.hasTouch && state.startFlag
  }, /*#__PURE__*/React.createElement(CaretLeftOutlined, {
    className: "m78-tab_start-ctrl",
    title: "\u4E0A\u7FFB",
    onClick: methods.scrollPrev
  })), state.startFlag && /*#__PURE__*/React.createElement("div", {
    className: cls('m78-tab_scroll-flag __start', isVertical && '__isVertical')
  }), state.endFlag && /*#__PURE__*/React.createElement("div", {
    className: cls('m78-tab_scroll-flag', isVertical && '__isVertical')
  }), /*#__PURE__*/React.createElement(If, {
    when: !state.hasTouch && state.endFlag
  }, /*#__PURE__*/React.createElement(CaretRightOutlined, {
    className: "m78-tab_end-ctrl",
    title: "\u4E0B\u7FFB",
    onClick: methods.scrollNext
  })), /*#__PURE__*/React.createElement("div", {
    className: "m78-tab_tabs",
    ref: share.scroller.ref
  }, childProps.map(function (item, index) {
    return /*#__PURE__*/React.createElement("div", {
      key: item.value,
      className: cls('m78-tab_tabs-item m78-effect __md', {
        __active: val === index,
        __disabled: item.disabled
      }),
      onClick: function onClick() {
        return onTabClick(item, index);
      },
      ref: function ref(node) {
        return self.tabRefs[index] = node;
      }
    }, /*#__PURE__*/React.createElement("div", null, item.label));
  }), !noActiveLine && /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-tab_line",
    style: (_ref2 = {}, _defineProperty(_ref2, isVertical ? 'height' : 'width', spProps.length.to(function (w) {
      return "".concat(w, "px");
    })), _defineProperty(_ref2, "transform", spProps.offset.to(function (ofs) {
      return "translate3d(".concat(isVertical ? 0 : ofs, "px, ").concat(isVertical ? ofs : 0, "px, 0px)");
    })), _ref2)
  }))), /*#__PURE__*/React.createElement(Carousel, {
    className: "m78-tab_cont",
    ref: carouselRef,
    initPage: val,
    noShadow: true,
    noScale: true,
    loop: loop,
    control: false,
    invisibleHidden: invisibleHidden,
    invisibleUnmount: invisibleUnmount,
    height: height,
    vertical: isVertical,
    onChange: function onChange(index, first) {
      !first && setVal(index);
    }
  }, child));
};

Tab.defaultProps = defaultProps;

export default Tab;
export { TabItem };
