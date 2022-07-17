import React from 'react';
import { isArray, getFirstTruthyOrZero, isTruthyOrZero, ensureArray } from '@lxjx/utils';
import cls from 'clsx';
import { CheckOutlined, CloseCircleOutlined } from 'm78/icon';
import { ListChildComponentProps } from 'react-window';
import { RenderItemData, SelectCustomTag, SelectOptionItem, SelectProps } from './type';

/** 根据SelectOptionItem取value */
export function getValue(item: SelectOptionItem, key: string) {
  return getFirstTruthyOrZero(item[key]);
}

/** 根据SelectOptionItem取label */
export function getLabel(item: SelectOptionItem, key: string, vKey: string) {
  return getFirstTruthyOrZero(item[key], item[vKey]);
}

/** 根据传入的key过滤出用于展示的选项列表 */
export function filterOptionsHandler(props: {
  key: string;
  options: SelectOptionItem[];
  checked: any[];
  hideSelected: boolean;
  isChecked: (val: any) => void;
  valueKey: string;
  searchKeys: SelectProps<any>['searchKeys'];
}) {
  if (!props.key && !props.hideSelected) return props.options;

  return props.options.filter(option => {
    if (props.hideSelected && props.isChecked(getValue(option, props.valueKey))) {
      return false;
    }

    const label = getLabel(option, props.key, props.valueKey);

    if (typeof label === 'string' && label.includes(props.key)) return true;

    if (props.searchKeys) {
      const list = ensureArray(props.searchKeys);

      for (const k of list) {
        const v = option[k];
        if (typeof v === 'string' && v.includes(props.key)) return true;
      }
    }

    return false;
  });
}

/** 传入值是真值或0时，返回其组成的数组，否则返回一个空数组 */
const truthyGArray = (arg: any) => (isTruthyOrZero(arg) ? [arg] : []);

/** 处理传入的FormLike参数 */
export function getUseCheckConf(props: SelectProps<any>) {
  const conf: any = {};

  if ('value' in props) {
    conf.value = isArray(props.value) ? props.value : truthyGArray(props.value);
  }

  if ('defaultValue' in props) {
    conf.defaultValue = isArray(props.defaultValue)
      ? props.defaultValue
      : truthyGArray(props.defaultValue);
  }

  return conf;
}

interface Item extends ListChildComponentProps {
  data: RenderItemData;
}

/** 渲染选项, 用于实现虚拟滚动 */
export function RenderItem({ index, style, data }: Item) {
  const { options, labelKey, valueKey, checkIcon } = data;
  const item = options[index];

  const label = getLabel(item, labelKey, valueKey);
  const value = getValue(item, valueKey);

  const isDivider = item.type === 'divider';

  if (!label && !isDivider) {
    return null;
  }

  const _isChecked = data.isChecked(value);

  const disabled = data.isDisabled(value);

  const height = style.height!;

  return (
    <div
      className={cls('m78-select_item', {
        'm78-hb-b': !!item.type,
        __title: item.type === 'title',
        __divider: item.type === 'divider',
        __active: _isChecked,
        __disabled: disabled,
      })}
      style={{
        ...style,
        height: Number(height) - 2 /* 下边距 */,
      }}
      onClick={() => (item.type || disabled ? undefined : data.onCheckItem(value))}
    >
      {!isDivider && (
        <span className="ellipsis">
          {item.prefix && <span className="m78-select_prefix">{item.prefix}</span>}
          {label}
        </span>
      )}
      <span>
        {_isChecked && checkIcon && <CheckOutlined className="m78-select_check-icon" />}
        {item.suffix && <span className="m78-select_suffix">{item.suffix}</span>}
      </span>
    </div>
  );
}

/** 根据选中标签选项获取字符 */
export function showMultipleString(
  list: SelectOptionItem[],
  multipleMaxShowLength: number,
  key: string,
  vKey: string,
) {
  let s = '';
  for (let i = 0; i < list.length; i++) {
    const current = list[i];

    if (multipleMaxShowLength > 0 && i === multipleMaxShowLength) {
      return `${s} ...等${list.length}个选项`;
    }

    if (current) {
      const lb = getLabel(current, key, vKey);

      s = s ? `${s}, ${lb}` : lb;
    }
  }
  return s;
}

export const buildInTagRender: SelectCustomTag = ({ label, del, key, className }) => (
  <span className={cls(className, 'm78-select_tag')} key={key}>
    <span className="m78-select_close-btn" title="删除">
      <CloseCircleOutlined onClick={del} />
    </span>
    <span className="ellipsis">{label}</span>
  </span>
);

/** 合并两组SelectOptionItem，并去除掉value重复的选项 */
export function mergeOptions(
  source1: SelectOptionItem[],
  source2: SelectOptionItem[],
  valueKey = 'value',
) {
  const map: any = {};

  const allSource = [source1, source2];

  allSource.forEach(s => {
    s.forEach(opt => {
      const vK = getValue(opt, valueKey);
      map[vK] = opt;
    });
  });

  const mergeOpt = [];

  for (const key in map) {
    if (map.hasOwnProperty(key)) {
      mergeOpt.push(map[key]);
    }
  }

  return mergeOpt;
}
