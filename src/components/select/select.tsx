import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Input } from 'm78/input';
import { Popper, PopperDirectionEnum, PopperRef, PopperTriggerEnum } from 'm78/popper';
import { Spin } from 'm78/spin';
import { Empty } from 'm78/empty';
import { Button } from 'm78/button';
import { DownOutlined } from 'm78/icon';
import { If } from 'm78/fork';
import { getCurrentParent } from '@lxjx/utils';
import _debounce from 'lodash/debounce';

import { VariableSizeList as FixedList } from 'react-window';

import cls from 'clsx';

import { useCheck, useFn, useFormState, useSelf, useSetState } from '@lxjx/hooks';
import { SelectProps, RenderItemData, SelectCustomTagMeta } from './type';
import {
  CustomPopper,
  filterOptionsHandler,
  getLabel,
  getUseCheckConf,
  getValue,
  RenderItem,
  showMultipleString,
  buildInTagRender,
} from './statics';

function Select<ValType = string, Options = any>(props: SelectProps<ValType, Options>) {
  const {
    className,
    style,
    listMaxHeight = 200,
    listWidth,
    listItemHeight = 36,
    multiple,
    showTag = true,
    hideSelected = false,
    options = [],
    placeholder,
    multipleMaxShowLength = 8,
    toolbar = true,
    customToolBar,
    customTag,
    inputLoading,
    listLoading,
    loading,
    blockLoading,
    labelKey = 'label',
    valueKey = 'value',
    notExistValueTrigger,
    disabled,
    listStyle,
    listClassName,
    size,
    search = false,
    maxLength,
    status,
    notBorder,
    underline,
    disabledOption,
    debounceTime = 300,
    onSearch,
    onAddTag,
    direction = PopperDirectionEnum.bottomStart,
    trigger = PopperTriggerEnum.click,
    arrow,
    checkIcon = true,
    children,
  } = props;

  const self = useSelf({
    isFocus: false,
  });

  const [state, setState] = useSetState({
    inputWidth: 0,
  });

  const popperRef = useRef<PopperRef>(null!);

  const conf = useMemo(() => getUseCheckConf(props), [props.value]);

  const [show, setShow] = useFormState(props, false, {
    triggerKey: 'onShowChange',
    defaultValueKey: 'defaultShow',
    valueKey: 'show',
  });

  const checkHelper = useCheck<any>({
    ...conf,
    options,
    collector: item => getValue(item, valueKey),
    onChange(val, opt) {
      props.onChange?.(multiple ? val : val[0], multiple ? opt : opt[0]);
      setTimeout(() => {
        popperRef.current?.refresh();
      });
    },
    notExistValueTrigger,
    disables: disabledOption,
  });

  const isDropDown = !!children;

  const {
    checked,
    check,
    toggle,
    unCheck,
    isChecked,
    setChecked,
    originalChecked,
    allChecked,
    toggleAll,
    checkAll,
    unCheckAll,
    isDisabled,
  } = checkHelper;

  const inpRef = useRef<HTMLInputElement>(null!);

  /** 指向input的value */
  const [inpVal, setInpVal] = useState('');

  /** 延迟版的inpVal */
  const [inpDebounceVal, setInpDebounceVal] = useState(inpVal);

  /** 经过筛选后的选项列表 */
  const [filterOptions, setFilterOpt] = useState(() =>
    filterOptionsHandler(inpVal, options, checked, hideSelected, isChecked, valueKey),
  );

  /** 获取输入框宽度 */
  useEffect(() => {
    if (!inpRef.current || listWidth || isDropDown) return;

    const pNode = inpRef.current.parentNode as HTMLElement;

    if (!pNode) return;

    const w = pNode.offsetWidth;

    if (w && state.inputWidth !== w) {
      setState({
        inputWidth: pNode.offsetWidth,
      });
    }
  });

  useEffect(() => {
    setFilterOpt(filterOptionsHandler(inpVal, options, checked, hideSelected, isChecked, valueKey));
  }, [inpDebounceVal, options, hideSelected]);

  const onKeyDebounceChange = useFn(
    key => {
      setInpDebounceVal(key);
      key && onSearch?.(key);
    },
    fn => _debounce(fn, debounceTime),
  );

  /** 输入框值改变 */
  const onKeyChange = useFn(key => {
    setInpVal(key);
    onKeyDebounceChange(key);
  });

  /** 点击某项 */
  const onCheckItem = useFn((_val: any) => {
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
  const itemData: RenderItemData = {
    listItemHeight,
    isChecked,
    isDisabled,
    onCheckItem,
    options: filterOptions,
    labelKey,
    valueKey,
    checkIcon: isDropDown ? false : checkIcon,
  };

  const onFocus = useFn(() => {
    self.isFocus = true;
    setShow(true);
  });

  const addTagFn = useFn(() => {
    // 触发新增标签并清空输入值
    if (inpVal) {
      onAddTag?.(inpVal, (val: any) => {
        // 防止check在合并选项后立刻被调用
        setTimeout(() => {
          multiple ? check(val) : setChecked([val]);
        });
      });

      setInpVal('');
    }
  });

  const onKeyDown = useFn((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 9) {
      setShow(false);
    }
    if (onAddTag && e.keyCode === 13) {
      addTagFn();
    }
  });

  const onPopperClose = useFn((_show: boolean) => {
    if (_show && disabled) return;

    if (!multiple) {
      setShow(_show);
      return;
    }
    if (!_show) setShow(false);
  });

  const onShow = useFn(({ target }: any) => {
    if (target) {
      const isCloseBtn = getCurrentParent(
        target,
        node => node.className === 'm78-select_close-btn',
        5,
      );
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

  const onHide = useFn(() => {
    setShow(false);
  });

  function renderVirtualList() {
    return (
      <FixedList
        height={listMaxHeight}
        itemCount={filterOptions.length}
        itemSize={index => {
          const current = filterOptions[index];
          return current.type === 'divider' ? 1 : listItemHeight;
        }}
        itemKey={(index, data) => {
          const current = data.options[index];
          return getValue(current, valueKey);
        }}
        itemData={itemData}
        width="100%"
        key="virtual"
        className="m78-scrollbar"
      >
        {RenderItem}
      </FixedList>
    );
  }

  function renderNormalList() {
    return filterOptions.map((item, index) => (
      <RenderItem
        key={getValue(item, valueKey) || index}
        index={index}
        style={{ height: item.type === 'divider' ? 1 : listItemHeight }}
        data={itemData}
      />
    ));
  }

  /** 选项列表 */
  function renderList() {
    // 数据大于20条时，启用虚拟滚动
    const hasVirtual = filterOptions.length > 20;

    let barShow = false;

    if (toolbar && multiple) {
      barShow = true;
    }

    if (multiple && onAddTag) {
      barShow = true;
    }

    if (customToolBar) {
      barShow = true;
    }

    return (
      <div
        className={cls('m78-select_list', { __disabled: disabled })}
        style={{ width: listWidth || state.inputWidth || undefined }}
      >
        {(listLoading || loading) && <Spin full size="small" text={null} />}
        {!filterOptions.length && <Empty size="small" desc="暂无相关内容" />}
        <div
          className="m78-scrollbar"
          style={{ maxHeight: listMaxHeight, overflow: 'auto' }}
          onClick={multiple ? undefined : onHide}
        >
          {hasVirtual ? renderVirtualList() : renderNormalList()}
        </div>
        {barShow && renderToolbar()}
      </div>
    );
  }

  /** 操作栏 */
  function renderToolbar() {
    const bar = (
      <div className="m78-select_toolbar-inner m78-hb-t">
        <div className="color-second fs-sm">
          已选中{checked.length}项
          <If when={maxLength && checked.length >= maxLength}>
            <span className="color-error"> (已达最大选中数)</span>
          </If>
        </div>
        <div>
          <If when={onAddTag && inpVal}>
            <Button text color="blue" onClick={addTagFn} size="small">
              添加标签
            </Button>
          </If>
          <If when={filterOptions.length && checked.length}>
            <Button text onClick={unCheckAll} size="small">
              清空
            </Button>
          </If>
          <If when={maxLength === undefined && filterOptions.length}>
            <Button text onClick={checkAll} size="small" color={allChecked ? 'primary' : undefined}>
              全选
            </Button>
            <Button text onClick={toggleAll} size="small">
              反选
            </Button>
          </If>
        </div>
      </div>
    );
    return <div className="m78-select_toolbar">{customToolBar ? customToolBar(bar) : bar}</div>;
  }

  /** tag列表 */
  function renderPrefix() {
    // 对multipleMaxShowLength进行截取处理, 文本类型的多选需要额外处理
    const hasSlice = multipleMaxShowLength > 0;
    const isMax = originalChecked.length > multipleMaxShowLength;

    const list = hasSlice
      ? originalChecked.slice(0, multipleMaxShowLength)
      : originalChecked.slice();

    return (
      <div className="m78-select_tags" onClick={onShow}>
        {list.map((item, index) => {
          const val = getValue(item, valueKey);

          const meta: SelectCustomTagMeta = {
            index,
            key: val,
            option: item,
            del() {
              !disabled && unCheck(val);
            },
            label: getLabel(item, labelKey, valueKey),
            className: cls(
              {
                __disabled: disabled || item.disabled,
              },
              size && `__${size}`,
            ),
          };

          return customTag ? customTag(meta, props) : buildInTagRender(meta, props);
        })}
        {hasSlice && isMax && <span>{`...等${originalChecked.length}个选项`}</span>}
      </div>
    );
  }

  /** input */
  function renderInput() {
    /** 多选 + 显示标签 */
    const showMultipleTag = multiple && showTag;
    /** 用placeholder来显示已选值 */
    const showSelectString = !showMultipleTag;
    /** 根据showSelectString获取placeholder值 */
    const _placeholder = showSelectString
      ? showMultipleString(originalChecked, multipleMaxShowLength, labelKey, valueKey)
      : placeholder;

    return (
      <Input
        innerRef={inpRef}
        onClick={onShow}
        className={cls('m78-select', className, {
          __disabled: disabled, // 要同时为list设置
          __empty: checked.length === 0,
          '__not-search': !search,
          '__text-value': showSelectString,
          '__has-multiple-tag': showMultipleTag && originalChecked.length,
        })}
        status={status}
        style={style}
        onKeyDown={onKeyDown}
        placeholder={_placeholder || placeholder}
        prefix={showMultipleTag && originalChecked.length && renderPrefix()}
        suffix={<DownOutlined className={cls('m78-select_down-icon', { __reverse: show })} />}
        value={inpVal}
        onChange={onKeyChange}
        loading={inputLoading}
        blockLoading={loading || blockLoading}
        disabled={disabled}
        size={size}
        readOnly={!search}
        onFocus={onFocus}
        underline={underline}
        notBorder={notBorder}
      />
    );
  }

  /** 传入children时，作为dropdown使用，渲染children */
  function renderChildren() {
    return (
      <span className={cls('m78-select', className)} style={style}>
        {children}
      </span>
    );
  }

  return (
    <Popper
      offset={arrow ? 12 : 4}
      style={listStyle}
      className={cls('m78-select_popper', listClassName, {
        __hasArrow: arrow,
        __dropdown: isDropDown,
      })}
      content={renderList()}
      direction={direction}
      trigger={trigger}
      customer={CustomPopper}
      instanceRef={popperRef}
      show={show}
      onChange={onPopperClose}
      unmountOnExit={false}
    >
      {isDropDown ? renderChildren() : renderInput()}
    </Popper>
  );
}

Select.displayName = 'FrSelect';

export default Select;
