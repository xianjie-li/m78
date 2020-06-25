import { PopperPropsCustom } from '@lxjx/fr/lib/popper';
import React from 'react';
import { isArray } from '@lxjx/utils';
import cls from 'classnames';
import { CheckOutlined, CloseCircleOutlined } from '@lxjx/fr/lib/icon';
import { ListChildComponentProps } from 'react-window';
import { getFirstTruthyOrZero } from '@lxjx/fr/lib/util';
import { RenderItemData, SelectCustomTag, SelectOptionItem, SelectProps } from './type';

/** 自定义popper样式 */
export function CustomPopper(props: PopperPropsCustom) {
  const { content } = props;
  return <div className="fr-popper_content fr-select_popper">{content}</div>;
}

/** 根据SelectOptionItem取value */
export function getValue(item: SelectOptionItem, key: string) {
  return getFirstTruthyOrZero(item[key]);
}

/** 根据SelectOptionItem取label */
export function getLabel(item: SelectOptionItem, key: string, vKey: string) {
  return getFirstTruthyOrZero(item[key], item[vKey]);
}

/** 根据传入的key过滤出用于展示的选项列表 */
export function filterOptionsHandler(
  key: string,
  options: SelectOptionItem[],
  checked: any[],
  hideSelected: boolean,
  isChecked: (val: any) => void,
  valueKey: string,
) {
  if (!key && !hideSelected) return options;

  return options.filter(option => {
    if (typeof option.label !== 'string') return false;

    if (hideSelected && isChecked(getValue(option, valueKey))) {
      return false;
    }

    return option.label.includes(key);
  });
}

/** 处理传入的FormLike参数 */
export function getUseCheckConf(props: SelectProps<any>) {
  const conf: any = {};

  if ('value' in props) {
    conf.value = isArray(props.value) ? props.value : [props.value];
  }

  if ('defaultValue' in props) {
    conf.defaultValue = isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
  }

  return conf;
}

interface Item extends ListChildComponentProps {
  data: RenderItemData;
}

/** 渲染选项, 用于实现虚拟滚动 */
export function RenderItem({ index, style, data }: Item) {
  const { options, labelKey, valueKey } = data;
  const item = options[index];

  const label = getLabel(item, labelKey, valueKey);
  const value = getValue(item, valueKey);

  const isDivider = item.type === 'divider';

  if (!label && !isDivider) {
    return null;
  }

  const _isChecked = data.isChecked(value);

  const disabled = data.isDisabled(value);

  return (
    <div
      className={cls('fr-select_item', {
        'fr-hb-b': !!item.type,
        __title: item.type === 'title',
        __divider: item.type === 'divider',
        __active: _isChecked,
        __disabled: disabled,
      })}
      style={style}
      onClick={() => (item.type || disabled ? undefined : data.onCheckItem(value))}
    >
      {!isDivider && <span className="ellipsis">{label}</span>}
      {_isChecked && <CheckOutlined className="fr-select_check-icon" />}
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

export const buildInTagRender: SelectCustomTag = ({ label, del, index, className }) => (
  <span className={cls(className, 'fr-select_tag')} key={index}>
    <span className="fr-select_close-btn" title="删除">
      <CloseCircleOutlined onClick={del} />
    </span>
    {label}
  </span>
);
