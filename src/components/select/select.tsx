import React, { useEffect, useRef, useState } from 'react';

import Input from '@lxjx/fr/lib/input';
import Popper, { PopperRef } from '@lxjx/fr/lib/popper';
import Spin from '@lxjx/fr/lib/spin';
import Empty from '@lxjx/fr/lib/empty';
import Button from '@lxjx/fr/lib/button';
import { DownOutlined } from '@lxjx/fr/lib/icon';
import { If } from '@lxjx/fr/lib/fork';
import { getCurrentParent } from '@lxjx/fr/lib/util';
import _debounce from 'lodash/debounce';

import { VariableSizeList as FixedList } from 'react-window';

import cls from 'classnames';

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
  } = props;

  const self = useSelf({
    isFocus: false,
  });

  const [state, setState] = useSetState({
    inputWidth: 280,
  });

  const popperRef = useRef<PopperRef>(null!);

  const conf = getUseCheckConf(props);

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
    if (!inpRef.current || listWidth) return;

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
        node => node.className === 'fr-select_close-btn',
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
        className={cls('fr-select_list fr-scroll-bar', { __disabled: disabled })}
        style={{ width: listWidth || state.inputWidth }}
      >
        {(listLoading || loading) && <Spin full size="small" text={null} />}
        {!filterOptions.length && <Empty size="small" desc="暂无相关内容" />}
        <div
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
      <div className="fr-select_toolbar-inner fr-hb-t">
        <div className="color-second fs-12">
          已选中{checked.length}项
          <If when={maxLength && checked.length >= maxLength}>
            <span className="color-error"> (已达最大选中数)</span>
          </If>
        </div>
        <div>
          <If when={onAddTag && inpVal}>
            <Button link color="blue" onClick={addTagFn} size="small">
              添加标签
            </Button>
          </If>
          <If when={filterOptions.length && checked.length}>
            <Button link onClick={unCheckAll} size="small">
              清空
            </Button>
          </If>
          <If when={maxLength === undefined && filterOptions.length}>
            <Button link onClick={checkAll} size="small" color={allChecked ? 'primary' : undefined}>
              全选
            </Button>
            <Button link onClick={toggleAll} size="small">
              反选
            </Button>
          </If>
        </div>
      </div>
    );
    return <div className="fr-select_toolbar">{customToolBar ? customToolBar(bar) : bar}</div>;
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
      <div className="fr-select_tags" onClick={onShow}>
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

  /** 多选 + 显示标签 */
  const showMultipleTag = multiple && showTag;
  /** 用placeholder来显示已选值 */
  const showSelectString = !showMultipleTag;
  /** 根据showSelectString获取placeholder值 */
  const _placeholder = showSelectString
    ? showMultipleString(originalChecked, multipleMaxShowLength, labelKey, valueKey)
    : placeholder;

  return (
    <Popper
      offset={4}
      style={listStyle}
      className={cls(listClassName)}
      content={renderList()}
      direction="bottomStart"
      trigger="click"
      customer={CustomPopper}
      ref={popperRef}
      show={show}
      onChange={onPopperClose}
    >
      <Input
        innerRef={inpRef}
        onClick={onShow}
        className={cls('fr-select', className, {
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
        suffix={<DownOutlined className={cls('fr-select_down-icon', { __reverse: show })} />}
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
    </Popper>
  );
}

Select.displayName = 'FrSelect';

export default Select;
