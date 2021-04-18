import 'm78/tree/style';
import _extends from '@babel/runtime/helpers/extends';
import _objectSpread from '@babel/runtime/helpers/objectSpread2';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useFn, useSetState, useSelf, useCheck } from '@lxjx/hooks';
import cls from 'classnames';
import { areEqual, VariableSizeList } from 'react-window';
import Spin from 'm78/spin';
import Empty from 'm78/empty';
import { useDelayDerivedToggleStatus } from 'm78/hooks';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import _typeof from '@babel/runtime/helpers/typeof';
import _toConsumableArray from '@babel/runtime/helpers/toConsumableArray';
import { isBoolean, isArray, isTruthyArray, isTruthyOrZero, heightLightMatchString, isFunction, isNumber } from '@lxjx/utils';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import { Switch, If } from 'm78/fork';
import { LoadingOutlined, CaretRightOutlined, DownOutlined } from 'm78/icon';
import { stopPropagation } from 'm78/util';
import Check from 'm78/check';
import { SizeEnum } from 'm78/types';
import _objectWithoutProperties from '@babel/runtime/helpers/objectWithoutProperties';
import _clamp from 'lodash/clamp';
import _debounce from 'lodash/debounce';
import { useUpdateEffect } from 'react-use';
import Button from 'm78/button';
import Select from 'm78/select';
import Input from 'm78/input';

var defaultValueGetter = function defaultValueGetter(item) {
  return item.value || item.label;
};
var defaultLabelGetter = function defaultLabelGetter(item) {
  return item.label;
};
/** 预设尺寸 */

var sizeMap = {
  "default": {
    h: 26,
    identW: 20
  },
  small: {
    h: 20,
    identW: 16
  },
  large: {
    h: 36,
    identW: 24
  }
};
/* 将一个值合并到一个可能存在的数组中，并返回一个新数组，如果两个参数为falsy，返回undefined */

var connectVal2Array = function connectVal2Array(val, array) {
  if (!isArray(array)) return isTruthyOrZero(val) ? [val] : undefined;
  return [].concat(_toConsumableArray(array), [val]);
};
/**
 * 将OptionsItem[]的每一项转换为treeNode并平铺到数组返回, 同时返回一些实用信息
 * @param optionList - OptionsItem选项组，为空或不存在时返回空数组
 * @param conf
 * @param conf.valueGetter - 获取value的方法
 * @param conf.labelGetter - 获取label的方法
 * @param conf.skipSearchKeySplicing - 关闭关键词拼接，不需要时关闭以提升性能
 * @returns returns
 * @returns returns.list - 平铺的列表
 * @returns returns.expandableList - 所有可展开节点(不包括isLeaf)
 * @returns returns.expandableValues - 所有可展开节点的value(不包括isLeaf)
 * @returns returns.zList - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据
 * @returns returns.zListValues - 一个二维数组，第一级中的每一项都是对应索引层级的所有数据的value
 * @returns returns.disabledValues - 所有禁用项的value
 * @returns returns.disables - 所有禁用项
 * */


function flatTreeData(optionList, conf) {
  var list = [];
  var expandableList = [];
  var expandableValues = [];
  var disables = [];
  var disabledValues = [];
  var zList = [];
  var zListValues = [];
  var valueGetter = conf.valueGetter,
      labelGetter = conf.labelGetter,
      skipSearchKeySplicing = conf.skipSearchKeySplicing; // 将指定的TreeNode添加到它所有父级的descendants列表中

  function fillParentsDescendants(item) {
    if (!isTruthyArray(item.parents)) return;
    item.parents.forEach(function (p) {
      p.descendants && p.descendants.push(item);
      p.descendantsValues && p.descendantsValues.push(item.value);

      if (!isTruthyArray(item.children)) {
        p.descendantsWithoutTwigValues && p.descendantsWithoutTwigValues.push(item.value);
        p.descendantsWithoutTwig && p.descendantsWithoutTwig.push(item);
      }
    });
  } // 平铺data树, 获取总层级，所有可展开项id


  function flat() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var optList = arguments.length > 1 ? arguments[1] : undefined;
    var zIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var parent = arguments.length > 3 ? arguments[3] : undefined;

    if (isArray(optList)) {
      var siblings = [];
      var siblingsValues = [];
      optList.forEach(function (item, index) {
        var val = valueGetter(item);
        var label = labelGetter(item);

        var current = _objectSpread(_objectSpread({}, item), {}, {
          origin: item,
          zIndex: zIndex,
          values: connectVal2Array(val, parent === null || parent === void 0 ? void 0 : parent.values)
          /* value取值方式更换 */
          ,
          indexes: connectVal2Array(index, parent === null || parent === void 0 ? void 0 : parent.indexes),
          parents: connectVal2Array(parent, parent === null || parent === void 0 ? void 0 : parent.parents),
          siblings: null,
          siblingsValues: null,
          value: val,
          label: label,
          descendants: item.children ? [] : undefined,
          descendantsValues: item.children ? [] : undefined,
          descendantsWithoutTwig: item.children ? [] : undefined,
          descendantsWithoutTwigValues: item.children ? [] : undefined,
          fullSearchKey: typeof label === 'string' ? label : '',
          disabledChildren: [],
          disabledChildrenValues: []
        }); // 添加兄弟节点


        siblings.push(current);
        siblingsValues.push(val);
        current.siblings = siblings;
        current.siblingsValues = siblingsValues; // 添加父级节点value

        if (isArray(current.parents)) {
          current.parentsValues = current.parents.map(valueGetter);
        } // 为父节点添加child


        if (parent) {
          if (!parent.child) parent.child = [];
          parent.child.push(current);
        } // 添加到所有父节点的子孙列表


        fillParentsDescendants(current);
        target.push(current); // 加到可展开列表

        if (isTruthyArray(current.children)) {
          expandableList.push(current);
          expandableValues.push(current.value);
        } // 禁用列表


        if (current.disabled) {
          disabledValues.push(current.value);
          disables.push(current);

          if (isTruthyArray(current.parents)) {
            current.parents.forEach(function (p) {
              p.disabledChildren.push(current);
              p.disabledChildrenValues.push(current.value);
            });
          }
        } // 层级列表


        if (!zList[zIndex]) {
          zList[zIndex] = [];
          zListValues[zIndex] = [];
        }

        zList[zIndex].push(current);
        zListValues[zIndex].push(current.value); // 拼接关键词

        if (!skipSearchKeySplicing && current.fullSearchKey && isTruthyArray(current.parents)) {
          current.parents.forEach(function (p) {
            return p.fullSearchKey += current.fullSearchKey;
          });
        }

        if (isArray(item.children)) {
          flat(target, item.children, zIndex + 1, current);
        }
      });
    }
  }

  flat(list, optionList);
  return {
    list: list,
    expandableList: expandableList,
    expandableValues: expandableValues,
    zList: zList,
    zListValues: zListValues,
    disabledValues: disabledValues,
    disables: disables
  };
}
function isMultipleCheck(props) {
  if ('multipleCheckable' in props) {
    return !!props.multipleCheckable;
  }

  return false;
}
function isCheck(props) {
  if ('checkable' in props) {
    return !!props.checkable;
  }

  return false;
}
/** 单选时包装props以匹配useCheck */

function useValCheckArgDispose(props) {
  return useMemo(function () {
    var _p = _objectSpread({}, props);

    if (isCheck(props)) {
      if ('value' in props && props.value !== undefined) {
        _p.value = [props.value];
      }

      if ('defaultValue' in props && props.defaultValue !== undefined) {
        _p.defaultValue = [props.defaultValue];
      }

      _p.onChange = function (value, extra) {
        var _props$onChange;

        (_props$onChange = props.onChange) === null || _props$onChange === void 0 ? void 0 : _props$onChange.call(props, value[0], extra[0]);
      };

      return _p;
    }

    return props;
  }, [props]);
}
/** 如果传入值为字符，根据关键词裁剪并高亮字符中的所有字符 */

function highlightKeyword(label, keyword) {
  if (typeof label !== 'string' || !keyword) return '';
  return heightLightMatchString(label, keyword);
}
/** 帮助函数，过滤节点列表中所有包含禁用子项的节点并返回所有可用节点的value数组 */

function filterIncludeDisableChildNode(ls) {
  var next = [];
  ls.forEach(function (item) {
    if (!item.disabledChildrenValues.length) {
      next.push(item.value);
    }
  });
  return next;
}
/** 根据传入配置获取toolbar实际配置，如果启用会返回各项的启用配置对象 */

function getToolbarConf(toolbar) {
  if (!toolbar) return;
  var def = {
    check: true,
    fold: true,
    search: true,
    checkCount: true
  };
  if (isBoolean(toolbar)) return def;
  return _objectSpread(_objectSpread({}, def), toolbar);
}
/** 根据value和索引拼接字符串，用于onBeforeCapture等回调中更方便获取 */

function getValueIndexJointString(value, index) {
  return "".concat(_typeof(value), "##").concat(value, "##").concat(index);
}
/** 将splitValueIndexJointString处理过的字符裁剪为原始值 */

function splitValueIndexJointString(str) {
  var sp = str.split('##');
  if (sp.length !== 3) return null;

  var _sp = _slicedToArray(sp, 3),
      type = _sp[0],
      value = _sp[1],
      index = _sp[2];

  return [type === 'number' ? Number(value) : value, Number(index)];
}

var openRotateClassName = 'm78-tree_open-icon';
var TreeItem = /*#__PURE__*/React.memo(function (_ref) {
  var _data$children;

  var data = _ref.data,
      share = _ref.share,
      methods = _ref.methods,
      className = _ref.className,
      style = _ref.style,
      size = _ref.size,
      provided = _ref.provided,
      snapshot = _ref.snapshot;
  var openCheck = share.openCheck,
      valCheck = share.valCheck,
      props = share.props,
      isVirtual = share.isVirtual,
      state = share.state,
      loadingCheck = share.loadingCheck;
  var itemHeight = size.itemHeight,
      identWidth = size.identWidth;
  var indicatorLine = props.indicatorLine,
      expansionIcon = props.expansionIcon,
      checkStrictly = props.checkStrictly,
      emptyTwigAsNode = props.emptyTwigAsNode,
      onLoad = props.onLoad,
      onDataSourceChange = props.onDataSourceChange,
      _props$dataSource = props.dataSource,
      dataSource = _props$dataSource === void 0 ? [] : _props$dataSource,
      draggable = props.draggable;
  var isDraggable = provided && draggable;
  var value = data.value;
  var actions = data.actions;
  /** 是否包含children */

  var hasChildren = !!((_data$children = data.children) === null || _data$children === void 0 ? void 0 : _data$children.length);
  /** 是否展开 */

  var isOpen = openCheck.isChecked(value);
  /** 是否选中 */

  var isChecked = valCheck.isChecked(value);
  /** 单选多选类型检测 */

  var isSCheck = isCheck(props);
  var isMCheck = isMultipleCheck(props) && !isSCheck;
  /* 权重低于单选 */

  var isLoading = loadingCheck.isChecked(value);
  var isDisabled = props.disabled || valCheck.isDisabled(value) || isLoading;
  /** 是否为树枝节点 */

  var isTwig = checkIsTwig();
  /** 是否为动态加载树 */

  var isLoadTwig = checkIsLoadTwig();
  /** 是否为空的树枝节点 */

  var isEmptyTwig = isTwig && !hasChildren;
  /** 是否是同级中最后一项 */

  var isLast = indicatorLine
  /* 不显示时跳过检测 */
  && data.siblings[data.siblings.length - 1] === data;
  var iconStyle = {
    height: itemHeight,
    width: identWidth
  };
  var identUnitStyle = {
    width: identWidth
  };
  /** 处理值选中逻辑 */

  var valueCheckHandle = useFn(function () {
    if (isDisabled) return;

    if (isSCheck) {
      if (!isTwig || props.checkTwig) {
        valCheck.setChecked([value]);
      }
    }

    if (isMCheck) {
      /** 选中树枝节点时，更新子级选中状态 */
      if (hasChildren && checkStrictly) {
        if (isChecked || checkIsPartial()) {
          // 取消当前节点和所有子节点选中
          valCheck.unCheckList(methods.getSelfAndDescendants(data));
        } else {
          // 选中当前节点和所有子节点中不包含禁用子节点的节点
          var ls = methods.getSelfAndDescendantsItem(data);
          valCheck.checkList(filterIncludeDisableChildNode(ls));
        } // 更新所有父节点的选中状态


        setTimeout(function () {
          methods.syncParentsChecked(data);
        });
        return;
      } // 选中同时需要更新所有父节点状态


      checkStrictly ? methods.syncParentsChecked(data, !isChecked) // 兄弟节点全选、反选时同步所有父级
      : valCheck.toggle(value);
    }
  });
  /** 处理展开关闭逻辑 */

  var toggleHandle = useFn(function () {
    var _props$onNodeClick;

    if (isDisabled) return;
    (_props$onNodeClick = props.onNodeClick) === null || _props$onNodeClick === void 0 ? void 0 : _props$onNodeClick.call(props, data); // 单选时共享此事件

    isSCheck && valueCheckHandle();
    if (!isTwig && !isLoadTwig) return;

    if (isLoadTwig && !isOpen) {
      loadHandle();
    }

    if (isOpen) {
      // 已选中，移除当前级和所有子级
      openCheck.unCheckList(methods.getSelfAndDescendants(data));
    } else if (props.accordion) {
      // 手风琴开启，选中当前级和所有父级
      openCheck.setChecked(methods.getSelfAndParents(data));
    } else {
      // 正常单项选中
      openCheck.check(value);
    }
  });
  /** 检测是否半选 */

  function checkIsPartial() {
    // 当前项已选中
    if (isChecked || !checkStrictly) return false; // 查询子项

    var des = data.descendantsValues;
    if (!isTruthyArray(des)) return false;
    return des.some(valCheck.isChecked);
  }
  /** 检测是否为树枝节点 */


  function checkIsTwig() {
    if (!isArray(data.children)) return false;

    if (emptyTwigAsNode) {
      if (data.children.length === 0) return false;
    }

    return true;
  }
  /** 检测是否为需要动态加载的树枝节点 */


  function checkIsLoadTwig() {
    // 是否开启
    if (!isFunction(onLoad)) return false; // 已有子级的树枝节点排除

    if (isTwig && hasChildren) return false; // 标记为树叶节点的排除

    return !data.isLeaf;
  }
  /** 触发加载子级时的处理程序 */


  function loadHandle() {
    return _loadHandle.apply(this, arguments);
  }

  function _loadHandle() {
    _loadHandle = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _children, newDs;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (onLoad) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              loadingCheck.check(value);
              _context.prev = 3;
              _context.next = 6;
              return onLoad(data);

            case 6:
              _children = _context.sent;

              if (isTruthyArray(_children)) {
                data.origin.children = _children;
              } else {
                data.origin.isLeaf = true;
              }

              newDs = _toConsumableArray(dataSource);
              onDataSourceChange === null || onDataSourceChange === void 0 ? void 0 : onDataSourceChange(newDs);
              _context.next = 14;
              break;

            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](3);

            case 14:
              _context.prev = 14;
              // console.log('加载结束');
              loadingCheck.unCheck(value);
              return _context.finish(14);

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[3, 12, 14, 17]]);
    }));
    return _loadHandle.apply(this, arguments);
  }

  function renderIdent(parent, identInd) {
    // 当前层最后一个
    var currentLast = indicatorLine && isLast && identInd + 1 === data.zIndex;
    var child = parent.child; // 动态标识是否开启线

    var flag = true;

    if (data.parentsValues && child) {
      if (
      /** 如果父级的最后一个孩子是此节点的父级之一，则隐藏标识线 */
      data.parentsValues.includes(child[child.length - 1].value)) {
        flag = false;
      }
    }

    return /*#__PURE__*/React.createElement("span", {
      className: cls('m78-tree_ident-unit', props.rainbowIndicatorLine && "__c".concat(identInd % 5)),
      style: identUnitStyle,
      key: identInd
    }, indicatorLine && /*#__PURE__*/React.createElement(React.Fragment, null, !currentLast && flag && /*#__PURE__*/React.createElement("span", {
      className: "m78-tree_line-node m78-tree_line"
    }), currentLast && /*#__PURE__*/React.createElement("span", {
      className: "m78-tree_line-node m78-tree_turn-line"
    })));
  }

  function renderExpansionIcon() {
    if (expansionIcon) {
      if (isFunction(expansionIcon)) {
        return expansionIcon(isOpen, openRotateClassName);
      }

      return expansionIcon;
    }

    return /*#__PURE__*/React.createElement(CaretRightOutlined, {
      className: openRotateClassName
    });
  }

  function renderLabel() {
    if (state.keyword) {
      return /*#__PURE__*/React.createElement("span", {
        dangerouslySetInnerHTML: {
          __html: highlightKeyword(data.label, state.keyword)
        }
      });
    }

    return /*#__PURE__*/React.createElement("span", null, data.label);
  }
  /** 合并虚拟滚动style和拖拽style */


  function getStyle() {
    var sty = _objectSpread({}, style);

    if (isDraggable) {
      var _provided$draggablePr;

      var _sty = provided === null || provided === void 0 ? void 0 : (_provided$draggablePr = provided.draggableProps) === null || _provided$draggablePr === void 0 ? void 0 : _provided$draggablePr.style;

      Object.assign(sty, _sty);
    }

    return sty;
  }
  /** 获取拖动时用于展开的props */


  function getDragProps() {
    if (isDraggable) return _objectSpread(_objectSpread(_objectSpread({}, provided.draggableProps), provided.dragHandleProps), {}, {
      ref: provided.innerRef
    });
    return {};
  }

  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls('m78-tree_item', className, {
      __active: isChecked,
      __disabled: isDisabled,
      __dragging: snapshot === null || snapshot === void 0 ? void 0 : snapshot.isDragging,
      __combine: snapshot === null || snapshot === void 0 ? void 0 : snapshot.combineTargetFor
    }),
    onClick: toggleHandle,
    title: isEmptyTwig ? '空节点' : ''
  }, getDragProps(), {
    style: _objectSpread({
      height: itemHeight
    }, getStyle())
  }), isSCheck && isChecked && /*#__PURE__*/React.createElement("div", {
    className: "m78-tree_checked"
  }), /*#__PURE__*/React.createElement("div", {
    className: "m78-tree_main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-tree_ident"
  }, data.parents && data.parents.map(renderIdent), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(If, {
    when: isLoading
  }, /*#__PURE__*/React.createElement("span", {
    className: "m78-tree_icon color-primary",
    style: iconStyle
  }, /*#__PURE__*/React.createElement(LoadingOutlined, null))), /*#__PURE__*/React.createElement(If, {
    when: isTwig || isLoadTwig
  }, /*#__PURE__*/React.createElement("span", {
    className: cls('m78-tree_icon', {
      __open: isOpen,
      __empty: isEmptyTwig && !isLoadTwig
    }),
    style: iconStyle
  }, renderExpansionIcon())), /*#__PURE__*/React.createElement(If, null, /*#__PURE__*/React.createElement("span", {
    className: "m78-tree_icon",
    style: iconStyle
  }, data.icon || props.icon || /*#__PURE__*/React.createElement("span", {
    className: "m78-dot",
    style: {
      width: 3,
      height: 3
    }
  }))))), /*#__PURE__*/React.createElement("span", {
    className: cls('m78-tree_cont', isVirtual && 'ellipsis')
  }, /*#__PURE__*/React.createElement("span", stopPropagation, isMCheck && /*#__PURE__*/React.createElement(Check, {
    size: SizeEnum.small,
    type: "checkbox",
    partial: checkIsPartial(),
    checked: isChecked,
    disabled: isDisabled,
    onChange: valueCheckHandle
  })), renderLabel())), (props.actions || actions) && /*#__PURE__*/React.createElement("div", _extends({
    className: "m78-tree_action"
  }, stopPropagation), isFunction(actions) ? actions(data) : actions, isFunction(props.actions) ? props.actions(data) : props.actions));
}, areEqual);

var DragItem = function DragItem(props) {
  var data = props.data,
      index = props.index;
  return /*#__PURE__*/React.createElement(Draggable, {
    draggableId: getValueIndexJointString(data.value, index),
    index: index,
    key: data.value
  }, function (provided, snapshot) {
    return /*#__PURE__*/React.createElement(TreeItem, _extends({}, props, {
      provided: provided,
      snapshot: snapshot,
      index: index
    }));
  });
};

function useDragHandle(share, methods, showList) {
  var openCheck = share.openCheck;
  var beforeDragHandle = useFn(function (before) {
    var infos = splitValueIndexJointString(before.draggableId);
    if (!infos) return;

    var _infos = _slicedToArray(infos, 2),
        index = _infos[1];

    var current = showList[index];
    if (!current) return;
    openCheck.unCheckList(methods.getSelfAndDescendants(current));
  });
  return {
    beforeDragHandle: beforeDragHandle
  };
}

var VirtualItem = function VirtualItem(_ref) {
  var index = _ref.index,
      style = _ref.style,
      data = _ref.data;

  var list = data.data,
      itemProps = _objectWithoutProperties(data, ["data"]);

  var draggable = itemProps.share.props.draggable;
  var item = list[index]; // 使用低消耗的渲染占位，一定延迟后再切换真实节点，防止快速滚动、拖动造成不必要的计算消耗

  var _useState = useState(!itemProps.share.self.scrolling),
      _useState2 = _slicedToArray(_useState, 2),
      render = _useState2[0],
      setRender = _useState2[1];

  useEffect(function () {
    if (render) return;
    var t = setTimeout(function () {
      setRender(true);
    }, 100);
    return function () {
      return clearTimeout(t);
    };
  }, []);

  if (!render) {
    return /*#__PURE__*/React.createElement("div", {
      style: style,
      className: "m78-tree_skeleton"
    }, item.parents && item.parents.map(function (i) {
      return /*#__PURE__*/React.createElement("span", {
        key: i.value,
        style: {
          width: itemProps.size.identWidth
        }
      });
    }), /*#__PURE__*/React.createElement("span", {
      className: "m78-tree_skeleton-bar",
      style: {
        width: itemProps.size.itemHeight * 0.68
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "m78-tree_skeleton-bar"
    }, item.label));
  }

  if (!draggable) {
    return /*#__PURE__*/React.createElement(TreeItem, _extends({
      data: item,
      key: item.value
    }, itemProps, {
      style: style,
      index: index
    }));
  }

  return /*#__PURE__*/React.createElement(DragItem, _extends({
    data: item,
    key: item.value
  }, itemProps, {
    style: style,
    index: index
  }));
};

function useMethods(share) {
  var props = share.props,
      openCheck = share.openCheck,
      valCheck = share.valCheck,
      nodes = share.nodes,
      self = share.self,
      setState = share.setState;
  var itemHeight = props.itemHeight,
      identWidth = props.identWidth;
  /** 检测某项是否展开 */

  function isShow(item) {
    if (item.zIndex === 0) return true;
    var parents = item.parents;
    if (!isTruthyArray(parents)) return false;
    var p = parents[parents.length - 1];
    if (!p) return false;
    return openCheck.isChecked(p.value);
  }
  /** 获取传入节点和它的子孙节点的value数组 */


  function getSelfAndDescendants(item) {
    var all = [item.value];

    if (isArray(item.descendantsValues)) {
      all.push.apply(all, _toConsumableArray(item.descendantsValues));
    }

    return all;
  }
  /** 获取传入节点和它的子孙节点的数组 */


  function getSelfAndDescendantsItem(item) {
    var all = [item];

    if (isArray(item.descendants)) {
      all.push.apply(all, _toConsumableArray(item.descendants));
    }

    return all;
  }
  /** 获取传入节点和它的父节点点的数组 */


  function getSelfAndParents(item) {
    var all = [item.value];

    if (isArray(item.parentsValues)) {
      all.unshift.apply(all, _toConsumableArray(item.parentsValues));
    }

    return all;
  }
  /** 根据参数计算返回itemHeight和identWidth的值 */


  function getSize() {
    var size = {
      itemHeight: itemHeight,
      identWidth: identWidth
    };
    var hasH = isNumber(itemHeight);
    var hasW = isNumber(identWidth); // 优先使用直接传入的尺寸

    if (hasH && hasW) return size; // 回退尺寸

    var builtIn = sizeMap[props.size || 'default'];

    if (!hasH) {
      size.itemHeight = builtIn.h;
    }

    if (!hasW) {
      size.identWidth = builtIn.identW;
    }

    return size;
  }
  /** 获取要显示的列表 */


  function getShowList(list, keyword) {
    if (keyword) {
      var filterList = list.filter(function (item) {
        return item.fullSearchKey.indexOf(keyword) !== -1;
      });
      return filterList.filter(isShow);
    }

    return list.filter(isShow);
  }
  /** 展开所有项 */


  function openAll() {
    if (!nodes) return;
    openCheck.setChecked(nodes.expandableValues);
  }
  /** 展开到第几级(0开始)，超出或小于时会自动限定在界定层级 */


  function openToZ(z) {
    if (!nodes) return;
    if (!isNumber(z)) return;
    var zList = nodes.zListValues;

    var _z = _clamp(z, 0, zList.length - 1);

    var values = zList.slice(0, _z).reduce(function (p, i) {
      return [].concat(_toConsumableArray(p), _toConsumableArray(i));
    }, []);
    openCheck.setChecked(values);
  }
  /** 设置指定节点状态，并同步更新其所有父节点的选中状态，如果省略checked参数，则仅对父节点进行更新 */


  function syncParentsChecked(item, checked) {
    var checkList = [];
    var unCheckList = [];
    var i = item; // 当前项选中状态

    var lastCheck = checked; // 传入value时，以value设置当前项的值

    if (isBoolean(checked)) {
      // valCheck.setCheckBy(item.value, checked);
      checked ? checkList.push(item.value) : unCheckList.push(item.value);
    } else {
      lastCheck = valCheck.isChecked(item.value);
    }

    var _loop = function _loop() {
      var lastP = i.parents[i.parents.length - 1]; // 该项所有不含自身的兄弟节点

      var noSelfSiblings = []; // 兄弟节点中是否包含禁用项

      var hasDisabled = false; // eslint-disable-next-line no-loop-func

      i.siblings.forEach(function (it) {
        if (it.value !== i.value) {
          noSelfSiblings.push(it.value);
        }

        if (it.disabled) {
          hasDisabled = true;
        }
      }); // 有禁用项时、取消其所有父级选中并打断循环

      if (hasDisabled) {
        i.parentsValues && unCheckList.push.apply(unCheckList, _toConsumableArray(i.parentsValues));
        return "break";
      } // 所有兄弟节点均已选中


      var allCheck = noSelfSiblings.every(valCheck.isChecked) && lastCheck;
      allCheck ? checkList.push(lastP.value) : unCheckList.push(lastP.value);
      i = lastP;
      lastCheck = allCheck; // 当所有项的选中状态决定下一个父节点的选中状态
    };

    while (isTruthyArray(i.parents)) {
      var _ret = _loop();

      if (_ret === "break") break;
    }

    valCheck.unCheckList(unCheckList);
    setTimeout(function () {
      valCheck.checkList(checkList);
    });
  }
  /** 滚动处理 */


  var scrollHandle = useFn(function () {
    self.scrollingCheckTimer && clearTimeout(self.scrollingCheckTimer);
    self.scrolling = true;
    self.scrollingCheckTimer = setTimeout(function () {
      self.scrolling = false;
    }, 300
    /* 不需要严格精准 */
    );
  });
  /** 关键词变更 */

  var keywordChangeHandle = useFn(function (keyword) {
    setState({
      keyword: keyword
    });
  }, function (fn) {
    return _debounce(fn, 300);
  });
  return {
    isShow: isShow,
    openAll: openAll,
    openToZ: openToZ,
    getSelfAndDescendants: getSelfAndDescendants,
    getSelfAndParents: getSelfAndParents,
    getSize: getSize,
    getShowList: getShowList,
    scrollHandle: scrollHandle,
    keywordChangeHandle: keywordChangeHandle,
    syncParentsChecked: syncParentsChecked,
    getSelfAndDescendantsItem: getSelfAndDescendantsItem
  };
}

function useLifeCycle(share, methods) {
  var props = share.props,
      state = share.state,
      setState = share.setState,
      self = share.self;
  var defaultOpenAll = props.defaultOpenAll,
      defaultOpenZIndex = props.defaultOpenZIndex,
      dataSource = props.dataSource,
      valueGetter = props.valueGetter,
      labelGetter = props.labelGetter; // 同步平铺dataSource

  useEffect(function () {
    if (!dataSource) {
      setState({
        loading: false
      });
      return;
    }

    if (!state.loading) {
      setState({
        loading: true
      });
    }

    setTimeout(function () {
      var _share$toolbar;

      var flatTree = flatTreeData(dataSource, {
        valueGetter: valueGetter,
        labelGetter: labelGetter,
        skipSearchKeySplicing: !((_share$toolbar = share.toolbar) === null || _share$toolbar === void 0 ? void 0 : _share$toolbar.search)
      });
      setState({
        nodes: flatTree,
        loading: false
      });
    });
  }, [dataSource]); // 启用默认展开全部行为

  useEffect(function () {
    // nodes第一次初始化时执行
    if (defaultOpenAll && state.nodes && !self.defaultOpenTriggered) {
      methods.openAll();
      self.defaultOpenTriggered = true;
    }
  }, [defaultOpenAll, state.nodes]); // 搜索时自动展开全部

  useUpdateEffect(function () {
    setTimeout(methods.openAll);
  }, [state.keyword]); // 默认展开到指定层级

  useEffect(function () {
    // nodes第一次初始化时执行
    if (isNumber(defaultOpenZIndex) && state.nodes && !self.defaultOpenZIndexTriggered) {
      methods.openToZ(defaultOpenZIndex);
      self.defaultOpenZIndexTriggered = true;
    }
  }, [defaultOpenZIndex, state.nodes]);
}

var OPEN_ALL = 'OPEN_ALL';
var FOLD_ALL = 'FOLD_ALL';

var Toolbar = function Toolbar(_ref) {
  var valCheck = _ref.valCheck,
      list = _ref.list,
      nodes = _ref.nodes,
      methods = _ref.methods,
      props = _ref.props,
      toolbar = _ref.toolbar;
  var conf = toolbar;
  var isM = isMultipleCheck(props);
  var isDisabled = props.disabled;
  /** 生成展开选项 */

  var expansionOpt = useMemo(function () {
    if (!nodes) return [];
    var base = [{
      label: '全部展开',
      value: OPEN_ALL
    }, {
      label: '全部折叠',
      value: FOLD_ALL
    }];
    Array.from({
      length: nodes.zList.length
    }).forEach(function (_, ind) {
      base.push({
        label: "\u5C55\u5F00\u5230".concat(ind + 1, "\u7EA7"),
        value: String(ind)
      });
    });
    return base;
  }, [nodes]);
  /** 展开控制 */

  var expansionHandle = useFn(function (val) {
    if (val === OPEN_ALL) {
      methods.openAll();
      return;
    }

    if (val === FOLD_ALL) {
      methods.openToZ(0);
      return;
    }

    methods.openToZ(Number(val));
  });
  /** 全选处理 */

  var checkAllHandle = useFn(function () {
    if (!isTruthyArray(list)) return;
    valCheck.setChecked(filterIncludeDisableChildNode(list));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "m78-tree_toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-tree_toolbar-left"
  }, /*#__PURE__*/React.createElement(If, {
    when: isM && conf.check
  }, /*#__PURE__*/React.createElement(Button, {
    size: "small",
    text: true,
    color: valCheck.allChecked ? 'primary' : undefined,
    onClick: checkAllHandle,
    disabled: isDisabled
  }, "\u5168\u9009"), /*#__PURE__*/React.createElement(Button, {
    size: "small",
    text: true,
    onClick: valCheck.unCheckAll,
    disabled: isDisabled
  }, "\u53D6\u6D88\u5168\u90E8")), /*#__PURE__*/React.createElement(If, {
    when: conf.fold
  }, function () {
    return /*#__PURE__*/React.createElement(Select, {
      arrow: true,
      value: "",
      options: expansionOpt,
      onChange: expansionHandle,
      disabled: isDisabled
    }, /*#__PURE__*/React.createElement(Button, {
      size: "small",
      text: true,
      disabled: isDisabled
    }, "\u5C55\u5F00", /*#__PURE__*/React.createElement(DownOutlined, {
      className: "color-second",
      style: {
        fontSize: 8
      }
    })));
  }), /*#__PURE__*/React.createElement(If, {
    when: isM && conf.checkCount
  }, /*#__PURE__*/React.createElement("span", {
    className: "color-second ml-8"
  }, "\u5171", valCheck.checked.length, "/", list.length, "\u9879")), props.toolbarExtra), /*#__PURE__*/React.createElement(If, {
    when: conf.search
  }, /*#__PURE__*/React.createElement("div", {
    className: "m78-tree_toolbar-right"
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "\u5173\u952E\u8BCD\u641C\u7D22",
    disabled: isDisabled,
    size: "small",
    onChange: methods.keywordChangeHandle
  }))));
};

var defaultProps = {
  valueGetter: defaultValueGetter,
  labelGetter: defaultLabelGetter,
  indicatorLine: true,
  checkStrictly: true
};
/**
 * 拖拽
 * 拖动开始时，关闭开启状态
 * 停止在一个可展开节点上时，延迟一定时间后展开该节点
 * 放置时根据拖动位置调整左侧缩进
 * 拖放到元素上时，将其合并到元素末尾
 * */

function Tree(props) {
  var _state$nodes;

  var _ref = props,
      size = _ref.size,
      height = _ref.height,
      draggable = _ref.draggable; // 虚拟列表实例

  var virtualList = useRef(null);

  var _useSetState = useSetState({
    nodes: undefined,
    loading: true,
    keyword: ''
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];

  var self = useSelf({
    scrolling: false
  });
  /** 平铺列表 */

  var list = state.nodes ? state.nodes.list : [];
  /** 延迟设置的加载状态, 防止数据量较少时loading一闪而过 */

  var loading = useDelayDerivedToggleStatus(state.loading, 150);
  /** 是否开启虚拟滚动 */

  var isVirtual = !!(height && height > 0);
  /** 展开状态 */

  var openCheck = useCheck(_objectSpread(_objectSpread({}, props), {}, {
    options: list,
    collector: props.valueGetter,
    triggerKey: 'onOpensChange',
    valueKey: 'opens',
    defaultValueKey: 'defaultOpens',
    value: [],
    defaultValue: [],
    onChange: function onChange() {}
  }));
  /** 如果是单选类型，将props调整为兼容useCheck的格式并代理onChange */

  var checkProps = useValCheckArgDispose(props);
  /** 选中状态 */

  var valCheck = useCheck(_objectSpread(_objectSpread({}, checkProps), {}, {
    options: list,
    collector: props.valueGetter,
    disables: (_state$nodes = state.nodes) === null || _state$nodes === void 0 ? void 0 : _state$nodes.disabledValues
  }));
  /** 节点加载状态 */

  var loadingCheck = useCheck({});
  /** 共享状态 */

  var share = {
    openCheck: openCheck,
    valCheck: valCheck,
    loadingCheck: loadingCheck,
    props: props,
    nodes: state.nodes,
    state: state,
    setState: setState,
    self: self,
    isVirtual: isVirtual,
    list: list,
    toolbar: getToolbarConf(props.toolbar)
  };
  /** 内部方法 */

  var methods = useMethods(share);
  /** 生命周期 */

  useLifeCycle(share, methods);
  /** 实际显示的列表 */

  var showList = useMemo(function () {
    return methods.getShowList(list, state.keyword);
  }, [list, openCheck.checked, state.keyword]);
  /** 拖动相关 */

  var dragMetas = useDragHandle(share, methods, showList);
  /** item的尺寸信息(高度、缩进) */

  var sizeInfo = methods.getSize();
  var itemData = {
    size: sizeInfo,
    data: showList,
    share: share,
    methods: methods
  };

  function renderNormalList() {
    if (!draggable) {
      return showList.map(function (item, index) {
        return /*#__PURE__*/React.createElement(TreeItem, _extends({
          key: item.value
        }, itemData, {
          data: item,
          index: index
        }));
      });
    }

    return renderDragList(function (provided) {
      return /*#__PURE__*/React.createElement("div", {
        ref: provided.innerRef
      }, showList.map(function (item, index) {
        return /*#__PURE__*/React.createElement(DragItem, _extends({
          key: item.value
        }, itemData, {
          data: item,
          index: index
        }));
      }), provided.placeholder);
    });
  }

  function renderVirtualList() {
    var getList = function getList(provided) {
      return /*#__PURE__*/React.createElement(VariableSizeList, {
        ref: virtualList,
        height: height || 0,
        itemCount: showList.length,
        itemSize: function itemSize(index) {
          return showList[index].height || sizeInfo.itemHeight;
        },
        estimatedItemSize: sizeInfo.itemHeight,
        width: "auto",
        className: "m78-tree_nodes",
        overscanCount: 3,
        itemData: itemData,
        itemKey: function itemKey(index) {
          return showList[index].value;
        },
        onScroll: methods.scrollHandle // 拖动
        ,
        outerRef: provided ? provided.innerRef : undefined
      }, VirtualItem);
    };

    if (!draggable) return getList();
    return renderDragList(getList);
  }

  function renderDragPlaceHolder(provided, snapshot, rubric) {
    return /*#__PURE__*/React.createElement(TreeItem, _extends({}, itemData, {
      provided: provided,
      snapshot: snapshot,
      data: showList[rubric.source.index],
      index: rubric.source.index
    }));
  }

  function renderDragList(renderChildren) {
    return /*#__PURE__*/React.createElement(Droppable, {
      droppableId: "m78-tree-droppable",
      mode: isVirtual ? 'virtual' : 'standard',
      isCombineEnabled: true,
      renderClone: isVirtual ? renderDragPlaceHolder : undefined
    }, renderChildren);
  }

  function renderList() {
    return isVirtual ? renderVirtualList() : renderNormalList();
  }

  var isSearchAndNoList = state.keyword && !isTruthyArray(showList);
  var isEmpty = isSearchAndNoList || !isTruthyArray(props.dataSource);
  return /*#__PURE__*/React.createElement(DragDropContext, {
    onDragEnd: function onDragEnd() {},
    onBeforeCapture: dragMetas.beforeDragHandle
  }, /*#__PURE__*/React.createElement("div", {
    className: cls('m78-tree m78-scroll-bar __hoverEffect __style', size && "__".concat(size))
  }, loading && /*#__PURE__*/React.createElement(Spin, {
    full: true,
    text: "\u7D22\u5F15\u6570\u636E\u4E2D..."
  }), share.toolbar && /*#__PURE__*/React.createElement(Toolbar, _extends({}, share, {
    methods: methods
  })), isEmpty && /*#__PURE__*/React.createElement(Empty, {
    desc: "\u6682\u65E0\u6570\u636E",
    className: "m78-tree_empty"
  }), !isEmpty && renderList()));
}

Tree.defaultProps = defaultProps;

export default Tree;
