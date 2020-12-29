import 'm78/expansion/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import React, { useContext, useMemo } from 'react';
import { useCheck, useFormState, useSelf, useMeasure, useMountExist } from '@lxjx/hooks';
import cls from 'classnames';
import _extends from '@babel/runtime/helpers/extends';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { isFunction } from '@lxjx/utils';
import Button from 'm78/button';
import { CaretUpOutlined, CaretDownOutlined, CaretRightOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { stopPropagation } from 'm78/util';
import { useSpring, config, animated } from 'react-spring';

var context = /*#__PURE__*/React.createContext({
  checker: null,
  accordion: false
});
var Provider = context.Provider,
    Consumer = context.Consumer;

function useCtx() {
  return useContext(context);
}

/* 嵌套时，将控制交给最外层 */

var Expansion = function Expansion(props) {
  /* baseProps是共享给子级ExpansionPane的ExpansionBase，其他的是Expansion自有的prop */
  var opens = props.opens,
      defaultOpens = props.defaultOpens,
      _onChange = props.onChange,
      _props$accordion = props.accordion,
      accordion = _props$accordion === void 0 ? false : _props$accordion,
      children = props.children,
      className = props.className,
      style = props.style,
      baseProps = _objectWithoutProperties(props, ["opens", "defaultOpens", "onChange", "accordion", "children", "className", "style"]);
  /** 处理useCheck配置， */


  var checkConf = useMemo(function () {
    var conf = {
      onChange: function onChange(ck) {
        _onChange === null || _onChange === void 0 ? void 0 : _onChange(ck); // 过滤参数2
      }
    };

    if ('opens' in props) {
      conf.value = opens;
    }

    if ('defaultOpens' in props) {
      conf.defaultValue = defaultOpens;
    }

    return conf;
  }, [props]);
  var checker = useCheck(checkConf);

  var ctxProps = _objectSpread(_objectSpread({
    // 默认配置
    transition: true,
    accordion: accordion
  }, baseProps), {}, {
    // 展开状态控制
    checker: checker
  });

  return /*#__PURE__*/React.createElement(Provider, {
    value: ctxProps
  }, /*#__PURE__*/React.createElement("div", {
    className: cls('m78-expansion', !props.noStyle && '__style', className),
    style: style
  }, children));
};

var ExpandIconPosition;
/** Expansion和ExpansionPane通用的props */

(function (ExpandIconPosition) {
  ExpandIconPosition["left"] = "left";
  ExpandIconPosition["bottom"] = "bottom";
  ExpandIconPosition["right"] = "right";
})(ExpandIconPosition || (ExpandIconPosition = {}));

var ExpansionPane = function ExpansionPane(props) {
  var _useCtx = useCtx(),
      checker = _useCtx.checker,
      accordion = _useCtx.accordion,
      ctxBaseProps = _objectWithoutProperties(_useCtx, ["checker", "accordion"]);
  /** 如果包含Expansion父级，则转交控制权 */


  var mixProps = useMemo(function () {
    var name = props.name; // 包含checker且组件传入了name，交由父级Expansion控制

    if (checker && name) {
      return _objectSpread(_objectSpread(_objectSpread({}, ctxBaseProps), props), {}, {
        open: checker.isChecked(name),
        onChange: function onChange(open) {
          var _props$onChange;

          (_props$onChange = props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(props, open);

          if (accordion) {
            checker.setChecked(open ? [name] : []);
          } else {
            checker.setCheckBy(name, open);
          }
        }
      });
    }

    return props;
  }, [ctxBaseProps, props]);
  var _mixProps$expandIconP = mixProps.expandIconPosition,
      iconPos = _mixProps$expandIconP === void 0 ? ExpandIconPosition.left : _mixProps$expandIconP,
      headerNode = mixProps.headerNode,
      disabled = mixProps.disabled,
      expandIcon = mixProps.expandIcon,
      noStyle = mixProps.noStyle,
      _mixProps$transition = mixProps.transition,
      transition = _mixProps$transition === void 0 ? true : _mixProps$transition,
      mountOnEnter = mixProps.mountOnEnter,
      unmountOnExit = mixProps.unmountOnExit,
      className = mixProps.className,
      style = mixProps.style;

  var _useFormState = useFormState(mixProps, false, {
    valueKey: 'open',
    defaultValueKey: 'defaultOpen'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      open = _useFormState2[0],
      set = _useFormState2[1];

  var self = useSelf({
    firstOpen: open
  }); // 测量高度

  var _useMeasure = useMeasure(),
      _useMeasure2 = _slicedToArray(_useMeasure, 2),
      contRef = _useMeasure2[0],
      height = _useMeasure2[1].height; // 实现mountOnEnter/unmountOnExit


  var _useMountExist = useMountExist({
    toggle: open,
    mountOnEnter: mountOnEnter,
    unmountOnExit: unmountOnExit,
    exitDelay: 800
  }),
      _useMountExist2 = _slicedToArray(_useMountExist, 1),
      mound = _useMountExist2[0];

  var spProps = useSpring({
    height: open ? height : 0,
    config: _objectSpread(_objectSpread({}, config.stiff), {}, {
      clamp: true
    }),
    immediate: !transition || self.firstOpen,
    onRest: function onRest() {
      self.firstOpen = false;
    }
  });
  /** 切换开关状态 */

  function toggle() {
    if (disabled) return;
    set(function (prev) {
      return !prev;
    });
  }
  /** 渲染展开标识图标 */


  function renderPropsIcon(clsName) {
    if (isFunction(expandIcon)) {
      return expandIcon(open, clsName);
    }

    return expandIcon;
  }

  function renderHeader() {
    if (headerNode === null) return null;

    if ( /*#__PURE__*/React.isValidElement(headerNode)) {
      // 挂载事件
      return /*#__PURE__*/React.cloneElement(headerNode, {
        onClick: toggle
      });
    }

    var iconClassName = cls('m78-expansion_header-leading', {
      __right: iconPos === ExpandIconPosition.right,
      __open: open
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-expansion_header",
      onClick: toggle
    }, /*#__PURE__*/React.createElement(If, {
      when: iconPos === ExpandIconPosition.left || iconPos === ExpandIconPosition.right
    }, renderPropsIcon(iconClassName) || /*#__PURE__*/React.createElement("div", {
      className: iconClassName
    }, /*#__PURE__*/React.createElement(CaretRightOutlined, null))), /*#__PURE__*/React.createElement("div", {
      className: "m78-expansion_header-body"
    }, props.header), props.actions && /*#__PURE__*/React.createElement("div", _extends({
      className: "m78-expansion_header-action"
    }, stopPropagation), props.actions));
  }

  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-expansion_item', className, {
      __active: open,
      __disabled: disabled,
      __style: !noStyle
    }),
    style: style
  }, iconPos === ExpandIconPosition.bottom && (renderPropsIcon('m78-expansion_bottom-flag') || /*#__PURE__*/React.createElement("div", {
    title: open ? '收起' : '展开',
    className: "m78-expansion_bottom-flag",
    onClick: toggle
  }, /*#__PURE__*/React.createElement(Button, {
    text: true
  }, open ? /*#__PURE__*/React.createElement(CaretUpOutlined, null) : /*#__PURE__*/React.createElement(CaretDownOutlined, null)))), renderHeader(), /*#__PURE__*/React.createElement(animated.div, {
    className: "m78-expansion_content-wrap",
    style: spProps
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-expansion_content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-expansion_calc-node",
    ref: contRef
  }), mound && props.children)));
};

export default Expansion;
export { ExpandIconPosition, ExpansionPane };
