import React, { useMemo, useRef, useState } from 'react';

import Input from '@lxjx/fr/lib/input';
import Popper, { PopperRef } from '@lxjx/fr/lib/popper';
import Spin from '@lxjx/fr/lib/spin';
import Empty from '@lxjx/fr/lib/empty';
import Button from '@lxjx/fr/lib/button';
import { If } from '@lxjx/fr/lib/fork';

import { VariableSizeList as FixedList } from 'react-window';

import cls from 'classnames';

import { useCheck, useDebounce, useFn, useFormState, useSelf } from '@lxjx/hooks';
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
    listWidth = 400,
    listItemHeight = 36,
    multiple,
    showTag = true,
    hideSelected = false,
    options = [],
    placeholder,
    multipleMaxShowLength = 8,
    toolbar = false,
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
  } = props;

  const self = useSelf({
    isFocus: false,
  });

  const popperRef = useRef<PopperRef>(null!);

  const conf = getUseCheckConf(props);

  const [show, setShow] = useFormState(props, false, {
    triggerKey: 'onShowChange',
    defaultValueKey: 'defaultShow',
    valueKey: 'show',
  });

  // useClickAway()

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
  });

  const {
    checked,
    toggle,
    unCheck,
    isChecked,
    setChecked,
    originalChecked,
    allChecked,
    toggleAll,
    checkAll,
  } = checkHelper;

  /** 指向input的value */
  const [inpVal, setInpVal] = useState('');

  /** 经过筛选后的选项列表 */
  const filterOptions = useMemo(
    () => filterOptionsHandler(inpVal, options, checked, hideSelected, isChecked, valueKey),
    [inpVal, options, checked, hideSelected],
  );

  /** 输入框值改变 */
  const onKeyChange = useDebounce(key => {
    setInpVal(key);
  }, 200);

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
    onCheckItem,
    options: filterOptions,
    labelKey,
    valueKey,
  };

  function onFocus() {
    self.isFocus = true;
    setShow(true);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 9) {
      setShow(false);
    }
  }

  function onPopperClose(_show: boolean) {
    if (!multiple) {
      setShow(_show);
      return;
    }
    if (!_show) setShow(false);
  }

  function onShow() {
    if (!multiple) {
      if (search && !show) {
        setShow(true);
      }
      return;
    }
    setShow(true);
  }

  function onHide() {
    setShow(false);
  }

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

    return (
      <div
        className={cls('fr-select_list fr-scroll-bar', { __disabled: disabled })}
        style={{ width: listWidth }}
      >
        {(listLoading || loading) && <Spin full size="small" text={null} />}
        {!filterOptions.length && <Empty size="small" desc="暂无相关内容" />}
        <div
          style={{ maxHeight: listMaxHeight, overflow: 'auto' }}
          onClick={multiple ? undefined : onHide}
        >
          {hasVirtual ? renderVirtualList() : renderNormalList()}
        </div>
        {((toolbar && !!filterOptions.length && multiple) || customToolBar) && renderToolbar()}
      </div>
    );
  }

  /** 操作栏 */
  function renderToolbar() {
    /* TODO: Check添加size选项 */
    const bar = (
      <div className="fr-select_toolbar-inner fr-hb-t">
        <div className="color-second fs-12">
          已选中{checked.length}项
          <If when={maxLength && checked.length >= maxLength}>
            <span className="color-error"> (已达最大选中数)</span>
          </If>
        </div>
        <div>
          <Button link onClick={() => setChecked([])} size="small">
            清空
          </Button>
          <If when={maxLength === undefined}>
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

    const list = hasSlice ? originalChecked.slice(0, multipleMaxShowLength) : originalChecked;

    return (
      <div className="fr-select_tags" onClick={onShow}>
        {list.map((item, index) => {
          const meta: SelectCustomTagMeta = {
            index,
            option: item,
            del() {
              !disabled && unCheck(getValue(item, valueKey));
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
        onClick={onShow}
        className={cls('fr-select', className, {
          __disabled: disabled, // 要同时为list设置
          __empty: checked.length === 0,
          '__not-search': !search,
          '__text-value': showSelectString,
          '__has-multiple-tag': showMultipleTag && originalChecked.length,
        })}
        style={style}
        onKeyDown={onKeyDown}
        placeholder={_placeholder || placeholder}
        prefix={showMultipleTag && originalChecked.length && renderPrefix()}
        value={inpVal}
        onChange={onKeyChange}
        loading={inputLoading}
        blockLoading={loading || blockLoading}
        disabled={disabled}
        size={size}
        readOnly={!search}
        onFocus={onFocus}
      />
    </Popper>
  );
}

Select.displayName = 'FrSelect';

export default Select;
