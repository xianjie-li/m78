import 'm78/select/style';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useRef, useMemo, useState, useEffect } from 'react';
import Input from 'm78/input';
import Popper, { PopperDirectionEnum, PopperTriggerEnum } from 'm78/popper';
import Spin from 'm78/spin';
import Empty from 'm78/empty';
import Button from 'm78/button';
import { CloseCircleOutlined, CheckOutlined, DownOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { getFirstTruthyOrZero, isArray, getCurrentParent } from '@lxjx/utils';
import _debounce from 'lodash/debounce';
import { VariableSizeList } from 'react-window';
import cls from 'classnames';
import { useSelf, useSetState, useFormState, useCheck, useFn } from '@lxjx/hooks';

/** 自定义popper样式 */
function CustomPopper(props) {
  var content = props.content;
  return /*#__PURE__*/React.createElement("div", {
    className: "m78-popper_content"
  }, content);
}
/** 根据SelectOptionItem取value */

function getValue(item, key) {
  return getFirstTruthyOrZero(item[key]);
}
/** 根据SelectOptionItem取label */

function getLabel(item, key, vKey) {
  return getFirstTruthyOrZero(item[key], item[vKey]);
}
/** 根据传入的key过滤出用于展示的选项列表 */

function filterOptionsHandler(key, options, checked, hideSelected, isChecked, valueKey) {
  if (!key && !hideSelected) return options;
  return options.filter(function (option) {
    if (typeof option.label !== 'string') return false;

    if (hideSelected && isChecked(getValue(option, valueKey))) {
      return false;
    }

    return option.label.includes(key);
  });
}
/** 处理传入的FormLike参数 */

function getUseCheckConf(props) {
  var conf = {};

  if ('value' in props) {
    conf.value = isArray(props.value) ? props.value : [props.value];
  }

  if ('defaultValue' in props) {
    conf.defaultValue = isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  }

  return conf;
}

/** 渲染选项, 用于实现虚拟滚动 */
function RenderItem(_ref) {
  var index = _ref.index,
      style = _ref.style,
      data = _ref.data;
  var options = data.options,
      labelKey = data.labelKey,
      valueKey = data.valueKey,
      checkIcon = data.checkIcon;
  var item = options[index];
  var label = getLabel(item, labelKey, valueKey);
  var value = getValue(item, valueKey);
  var isDivider = item.type === 'divider';

  if (!label && !isDivider) {
    return null;
  }

  var _isChecked = data.isChecked(value);

  var disabled = data.isDisabled(value);
  return /*#__PURE__*/React.createElement("div", {
    className: cls('m78-select_item', {
      'm78-hb-b': !!item.type,
      __title: item.type === 'title',
      __divider: item.type === 'divider',
      __active: _isChecked,
      __disabled: disabled
    }),
    style: style,
    onClick: function onClick() {
      return item.type || disabled ? undefined : data.onCheckItem(value);
    }
  }, !isDivider && /*#__PURE__*/React.createElement("span", {
    className: "ellipsis"
  }, item.prefix && /*#__PURE__*/React.createElement("span", {
    className: "m78-select_prefix"
  }, item.prefix), label), /*#__PURE__*/React.createElement("span", null, _isChecked && checkIcon && /*#__PURE__*/React.createElement(CheckOutlined, {
    className: "m78-select_check-icon"
  }), item.suffix && /*#__PURE__*/React.createElement("span", {
    className: "m78-select_suffix"
  }, item.suffix)));
}
/** 根据选中标签选项获取字符 */

function showMultipleString(list, multipleMaxShowLength, key, vKey) {
  var s = '';

  for (var i = 0; i < list.length; i++) {
    var current = list[i];

    if (multipleMaxShowLength > 0 && i === multipleMaxShowLength) {
      return "".concat(s, " ...\u7B49").concat(list.length, "\u4E2A\u9009\u9879");
    }

    if (current) {
      var lb = getLabel(current, key, vKey);
      s = s ? "".concat(s, ", ").concat(lb) : lb;
    }
  }

  return s;
}
var buildInTagRender = function buildInTagRender(_ref2) {
  var label = _ref2.label,
      del = _ref2.del,
      key = _ref2.key,
      className = _ref2.className;
  return /*#__PURE__*/React.createElement("span", {
    className: cls(className, 'm78-select_tag'),
    key: key
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-select_close-btn",
    title: "\u5220\u9664"
  }, /*#__PURE__*/React.createElement(CloseCircleOutlined, {
    onClick: del
  })), /*#__PURE__*/React.createElement("span", {
    className: "ellipsis"
  }, label));
};
/** 合并两组SelectOptionItem，并去除掉value重复的选项 */

function mergeOptions(source1, source2) {
  var valueKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'value';
  var map = {};
  var allSource = [source1, source2];
  allSource.forEach(function (s) {
    s.forEach(function (opt) {
      var vK = getValue(opt, valueKey);
      map[vK] = opt;
    });
  });
  var mergeOpt = [];

  for (var key in map) {
    if (map.hasOwnProperty(key)) {
      mergeOpt.push(map[key]);
    }
  }

  return mergeOpt;
}

function Select(props) {
  var className = props.className,
      style = props.style,
      _props$listMaxHeight = props.listMaxHeight,
      listMaxHeight = _props$listMaxHeight === void 0 ? 200 : _props$listMaxHeight,
      listWidth = props.listWidth,
      _props$listItemHeight = props.listItemHeight,
      listItemHeight = _props$listItemHeight === void 0 ? 36 : _props$listItemHeight,
      multiple = props.multiple,
      _props$showTag = props.showTag,
      showTag = _props$showTag === void 0 ? true : _props$showTag,
      _props$hideSelected = props.hideSelected,
      hideSelected = _props$hideSelected === void 0 ? false : _props$hideSelected,
      _props$options = props.options,
      options = _props$options === void 0 ? [] : _props$options,
      placeholder = props.placeholder,
      _props$multipleMaxSho = props.multipleMaxShowLength,
      multipleMaxShowLength = _props$multipleMaxSho === void 0 ? 8 : _props$multipleMaxSho,
      _props$toolbar = props.toolbar,
      toolbar = _props$toolbar === void 0 ? true : _props$toolbar,
      customToolBar = props.customToolBar,
      customTag = props.customTag,
      inputLoading = props.inputLoading,
      listLoading = props.listLoading,
      loading = props.loading,
      blockLoading = props.blockLoading,
      _props$labelKey = props.labelKey,
      labelKey = _props$labelKey === void 0 ? 'label' : _props$labelKey,
      _props$valueKey = props.valueKey,
      valueKey = _props$valueKey === void 0 ? 'value' : _props$valueKey,
      notExistValueTrigger = props.notExistValueTrigger,
      disabled = props.disabled,
      listStyle = props.listStyle,
      listClassName = props.listClassName,
      size = props.size,
      _props$search = props.search,
      search = _props$search === void 0 ? false : _props$search,
      maxLength = props.maxLength,
      status = props.status,
      notBorder = props.notBorder,
      underline = props.underline,
      disabledOption = props.disabledOption,
      _props$debounceTime = props.debounceTime,
      debounceTime = _props$debounceTime === void 0 ? 300 : _props$debounceTime,
      onSearch = props.onSearch,
      onAddTag = props.onAddTag,
      _props$direction = props.direction,
      direction = _props$direction === void 0 ? PopperDirectionEnum.bottomStart : _props$direction,
      _props$trigger = props.trigger,
      trigger = _props$trigger === void 0 ? PopperTriggerEnum.click : _props$trigger,
      arrow = props.arrow,
      _props$checkIcon = props.checkIcon,
      checkIcon = _props$checkIcon === void 0 ? true : _props$checkIcon,
      children = props.children;
  var self = useSelf({
    isFocus: false
  });

  var _useSetState = useSetState({
    inputWidth: 0
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  var popperRef = useRef(null);
  var conf = useMemo(function () {
    return getUseCheckConf(props);
  }, [props.value]);

  var _useFormState = useFormState(props, false, {
    triggerKey: 'onShowChange',
    defaultValueKey: 'defaultShow',
    valueKey: 'show'
  }),
      _useFormState2 = _slicedToArray(_useFormState, 2),
      show = _useFormState2[0],
      setShow = _useFormState2[1];

  var checkHelper = useCheck(_objectSpread(_objectSpread({}, conf), {}, {
    options: options,
    collector: function collector(item) {
      return getValue(item, valueKey);
    },
    onChange: function onChange(val, opt) {
      var _props$onChange;

      (_props$onChange = props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(props, multiple ? val : val[0], multiple ? opt : opt[0]);
      setTimeout(function () {
        var _popperRef$current;

        (_popperRef$current = popperRef.current) === null || _popperRef$current === void 0 ? void 0 : _popperRef$current.refresh();
      });
    },
    notExistValueTrigger: notExistValueTrigger,
    disables: disabledOption
  }));
  var isDropDown = !!children;
  var checked = checkHelper.checked,
      check = checkHelper.check,
      toggle = checkHelper.toggle,
      unCheck = checkHelper.unCheck,
      isChecked = checkHelper.isChecked,
      setChecked = checkHelper.setChecked,
      originalChecked = checkHelper.originalChecked,
      allChecked = checkHelper.allChecked,
      toggleAll = checkHelper.toggleAll,
      checkAll = checkHelper.checkAll,
      unCheckAll = checkHelper.unCheckAll,
      isDisabled = checkHelper.isDisabled;
  var inpRef = useRef(null);
  /** 指向input的value */

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      inpVal = _useState2[0],
      setInpVal = _useState2[1];
  /** 延迟版的inpVal */


  var _useState3 = useState(inpVal),
      _useState4 = _slicedToArray(_useState3, 2),
      inpDebounceVal = _useState4[0],
      setInpDebounceVal = _useState4[1];
  /** 经过筛选后的选项列表 */


  var _useState5 = useState(function () {
    return filterOptionsHandler(inpVal, options, checked, hideSelected, isChecked, valueKey);
  }),
      _useState6 = _slicedToArray(_useState5, 2),
      filterOptions = _useState6[0],
      setFilterOpt = _useState6[1];
  /** 获取输入框宽度 */


  useEffect(function () {
    if (!inpRef.current || listWidth || isDropDown) return;
    var pNode = inpRef.current.parentNode;
    if (!pNode) return;
    var w = pNode.offsetWidth;

    if (w && state.inputWidth !== w) {
      setState({
        inputWidth: pNode.offsetWidth
      });
    }
  });
  useEffect(function () {
    setFilterOpt(filterOptionsHandler(inpVal, options, checked, hideSelected, isChecked, valueKey));
  }, [inpDebounceVal, options, hideSelected]);
  var onKeyDebounceChange = useFn(function (key) {
    setInpDebounceVal(key);
    key && (onSearch === null || onSearch === void 0 ? void 0 : onSearch(key));
  }, function (fn) {
    return _debounce(fn, debounceTime);
  });
  /** 输入框值改变 */

  var onKeyChange = useFn(function (key) {
    setInpVal(key);
    onKeyDebounceChange(key);
  });
  /** 点击某项 */

  var onCheckItem = useFn(function (_val) {
    if (multiple) {
      if (maxLength !== undefined && checked.length >= maxLength) {
        if (isChecked(_val)) {
          unCheck(_val);
        }
      } else {
        toggle(_val);
      }

      return;
    }

    setChecked([_val]);
  });
  /** 传递给RenderItem的额外内容 */

  var itemData = {
    listItemHeight: listItemHeight,
    isChecked: isChecked,
    isDisabled: isDisabled,
    onCheckItem: onCheckItem,
    options: filterOptions,
    labelKey: labelKey,
    valueKey: valueKey,
    checkIcon: isDropDown ? false : checkIcon
  };
  var onFocus = useFn(function () {
    self.isFocus = true;
    setShow(true);
  });
  var addTagFn = useFn(function () {
    // 触发新增标签并清空输入值
    if (inpVal) {
      onAddTag === null || onAddTag === void 0 ? void 0 : onAddTag(inpVal, function (val) {
        // 防止check在合并选项后立刻被调用
        setTimeout(function () {
          multiple ? check(val) : setChecked([val]);
        });
      });
      setInpVal('');
    }
  });
  var onKeyDown = useFn(function (e) {
    if (e.keyCode === 9) {
      setShow(false);
    }

    if (onAddTag && e.keyCode === 13) {
      addTagFn();
    }
  });
  var onPopperClose = useFn(function (_show) {
    if (_show && disabled) return;

    if (!multiple) {
      setShow(_show);
      return;
    }

    if (!_show) setShow(false);
  });
  var onShow = useFn(function (_ref) {
    var target = _ref.target;

    if (target) {
      var isCloseBtn = getCurrentParent(target, function (node) {
        return node.className === 'm78-select_close-btn';
      }, 5);
      if (isCloseBtn) return;
    }

    if (!multiple) {
      if (search && !show) {
        setShow(true);
      }

      return;
    }

    setShow(true);
  });
  var onHide = useFn(function () {
    setShow(false);
  });

  function renderVirtualList() {
    return /*#__PURE__*/React.createElement(VariableSizeList, {
      height: listMaxHeight,
      itemCount: filterOptions.length,
      itemSize: function itemSize(index) {
        var current = filterOptions[index];
        return current.type === 'divider' ? 1 : listItemHeight;
      },
      itemKey: function itemKey(index, data) {
        var current = data.options[index];
        return getValue(current, valueKey);
      },
      itemData: itemData,
      width: "100%",
      key: "virtual",
      className: "m78-scrollbar"
    }, RenderItem);
  }

  function renderNormalList() {
    return filterOptions.map(function (item, index) {
      return /*#__PURE__*/React.createElement(RenderItem, {
        key: getValue(item, valueKey) || index,
        index: index,
        style: {
          height: item.type === 'divider' ? 1 : listItemHeight
        },
        data: itemData
      });
    });
  }
  /** 选项列表 */


  function renderList() {
    // 数据大于20条时，启用虚拟滚动
    var hasVirtual = filterOptions.length > 20;
    var barShow = false;

    if (toolbar && multiple) {
      barShow = true;
    }

    if (multiple && onAddTag) {
      barShow = true;
    }

    if (customToolBar) {
      barShow = true;
    }

    return /*#__PURE__*/React.createElement("div", {
      className: cls('m78-select_list', {
        __disabled: disabled
      }),
      style: {
        width: listWidth || state.inputWidth || undefined
      }
    }, (listLoading || loading) && /*#__PURE__*/React.createElement(Spin, {
      full: true,
      size: "small",
      text: null
    }), !filterOptions.length && /*#__PURE__*/React.createElement(Empty, {
      size: "small",
      desc: "\u6682\u65E0\u76F8\u5173\u5185\u5BB9"
    }), /*#__PURE__*/React.createElement("div", {
      className: "m78-scrollbar",
      style: {
        maxHeight: listMaxHeight,
        overflow: 'auto'
      },
      onClick: multiple ? undefined : onHide
    }, hasVirtual ? renderVirtualList() : renderNormalList()), barShow && renderToolbar());
  }
  /** 操作栏 */


  function renderToolbar() {
    var bar = /*#__PURE__*/React.createElement("div", {
      className: "m78-select_toolbar-inner m78-hb-t"
    }, /*#__PURE__*/React.createElement("div", {
      className: "color-second fs-12"
    }, "\u5DF2\u9009\u4E2D", checked.length, "\u9879", /*#__PURE__*/React.createElement(If, {
      when: maxLength && checked.length >= maxLength
    }, /*#__PURE__*/React.createElement("span", {
      className: "color-error"
    }, " (\u5DF2\u8FBE\u6700\u5927\u9009\u4E2D\u6570)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(If, {
      when: onAddTag && inpVal
    }, /*#__PURE__*/React.createElement(Button, {
      text: true,
      color: "blue",
      onClick: addTagFn,
      size: "small"
    }, "\u6DFB\u52A0\u6807\u7B7E")), /*#__PURE__*/React.createElement(If, {
      when: filterOptions.length && checked.length
    }, /*#__PURE__*/React.createElement(Button, {
      text: true,
      onClick: unCheckAll,
      size: "small"
    }, "\u6E05\u7A7A")), /*#__PURE__*/React.createElement(If, {
      when: maxLength === undefined && filterOptions.length
    }, /*#__PURE__*/React.createElement(Button, {
      text: true,
      onClick: checkAll,
      size: "small",
      color: allChecked ? 'primary' : undefined
    }, "\u5168\u9009"), /*#__PURE__*/React.createElement(Button, {
      text: true,
      onClick: toggleAll,
      size: "small"
    }, "\u53CD\u9009"))));
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-select_toolbar"
    }, customToolBar ? customToolBar(bar) : bar);
  }
  /** tag列表 */


  function renderPrefix() {
    // 对multipleMaxShowLength进行截取处理, 文本类型的多选需要额外处理
    var hasSlice = multipleMaxShowLength > 0;
    var isMax = originalChecked.length > multipleMaxShowLength;
    var list = hasSlice ? originalChecked.slice(0, multipleMaxShowLength) : originalChecked.slice();
    return /*#__PURE__*/React.createElement("div", {
      className: "m78-select_tags",
      onClick: onShow
    }, list.map(function (item, index) {
      var val = getValue(item, valueKey);
      var meta = {
        index: index,
        key: val,
        option: item,
        del: function del() {
          !disabled && unCheck(val);
        },
        label: getLabel(item, labelKey, valueKey),
        className: cls({
          __disabled: disabled || item.disabled
        }, size && "__".concat(size))
      };
      return customTag ? customTag(meta, props) : buildInTagRender(meta);
    }), hasSlice && isMax && /*#__PURE__*/React.createElement("span", null, "...\u7B49".concat(originalChecked.length, "\u4E2A\u9009\u9879")));
  }
  /** input */


  function renderInput() {
    /** 多选 + 显示标签 */
    var showMultipleTag = multiple && showTag;
    /** 用placeholder来显示已选值 */

    var showSelectString = !showMultipleTag;
    /** 根据showSelectString获取placeholder值 */

    var _placeholder = showSelectString ? showMultipleString(originalChecked, multipleMaxShowLength, labelKey, valueKey) : placeholder;

    return /*#__PURE__*/React.createElement(Input, {
      innerRef: inpRef,
      onClick: onShow,
      className: cls('m78-select', className, {
        __disabled: disabled,
        // 要同时为list设置
        __empty: checked.length === 0,
        '__not-search': !search,
        '__text-value': showSelectString,
        '__has-multiple-tag': showMultipleTag && originalChecked.length
      }),
      status: status,
      style: style,
      onKeyDown: onKeyDown,
      placeholder: _placeholder || placeholder,
      prefix: showMultipleTag && originalChecked.length && renderPrefix(),
      suffix: /*#__PURE__*/React.createElement(DownOutlined, {
        className: cls('m78-select_down-icon', {
          __reverse: show
        })
      }),
      value: inpVal,
      onChange: onKeyChange,
      loading: inputLoading,
      blockLoading: loading || blockLoading,
      disabled: disabled,
      size: size,
      readOnly: !search,
      onFocus: onFocus,
      underline: underline,
      notBorder: notBorder
    });
  }
  /** 传入children时，作为dropdown使用，渲染children */


  function renderChildren() {
    return /*#__PURE__*/React.createElement("span", {
      className: cls('m78-select', className),
      style: style
    }, children);
  }

  return /*#__PURE__*/React.createElement(Popper, {
    offset: arrow ? 12 : 4,
    style: listStyle,
    className: cls('m78-select_popper', listClassName, {
      __hasArrow: arrow,
      __dropdown: isDropDown
    }),
    content: renderList(),
    direction: direction,
    trigger: trigger,
    customer: CustomPopper,
    instanceRef: popperRef,
    show: show,
    onChange: onPopperClose,
    unmountOnExit: false
  }, isDropDown ? renderChildren() : renderInput());
}

Select.displayName = 'FrSelect';

export default Select;
export { CustomPopper, mergeOptions };
