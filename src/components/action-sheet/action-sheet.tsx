import React, { useState } from 'react';

import Drawer from 'm78/drawer';
import Check from 'm78/check';
import Button from 'm78/button';
import { If } from 'm78/fork';

import { useFormState } from '@lxjx/hooks';

import cls from 'classnames';

import createRenderApi from '@lxjx/react-render-api';
import { ActionSheetProps, ActionSheetItem } from './type';

function _ActionSheet<Val = any>(props: ActionSheetProps<Val>) {
  const { options, title = '请选择', confirm = true, ...other } = props;

  /** 实现value/onChange/defaultValue */
  const [value, setValue] = useFormState(props, undefined);

  /** 实现defaultShow/show/onShowChange */
  const [show, setShow] = useFormState<boolean>(props, false, {
    defaultValueKey: 'defaultShow',
    triggerKey: 'onShowChange',
    valueKey: 'show',
  });

  function close(val?: any, item?: ActionSheetItem) {
    setShow(false);

    props.onClose?.(val, item);
  }

  function getCurrentItem(val: any) {
    return options.find(item => item.value === val);
  }

  function renderItems() {
    return options.map(v => (
      <div
        key={v.value}
        onClick={() => {
          if (v.disabled) return;

          // 直接选中
          !confirm && close(v.value, getCurrentItem(v.value));

          if (value && v.value === value) return;

          setValue(v.value, getCurrentItem(v.value));
        }}
        className={cls('m78-action-sheet_item m78-effect m78-hb-t __md', {
          __active: v.value === value,
          __confirm: confirm,
          __disabled: v.disabled,
          __highlight: v.highlight,
        })}
      >
        <div className={cls(confirm && 'tl')}>
          <div className="m78-action-sheet_item-title">{v.label}</div>
          <If when={v.desc}>
            <div className="m78-action-sheet_desc">{v.desc}</div>
          </If>
        </div>
        <If when={confirm}>
          <span className="m78-action-sheet_check">
            <Check type="radio" checked={value === v.value} disabled={v.disabled} />
          </span>
        </If>
      </div>
    ));
  }

  return (
    <Drawer
      className="m78-action-sheet"
      // @ts-ignore
      namespace="ACTION_SHEET"
      {...other}
      onClose={() => close()}
      onChange={nShow => setShow(nShow)}
      show={show}
    >
      <div className="m78-action-sheet_item m78-effect __md __title __disabled">
        <If when={confirm}>
          <Button className="m78-action-sheet_confirm" onClick={() => close()} link color="red">
            取消
          </Button>
        </If>
        <div>{title}</div>
        <If when={confirm}>
          <Button
            onClick={() => {
              close(value, getCurrentItem(value));
            }}
            className="m78-action-sheet_confirm"
            color="primary"
          >
            {typeof confirm === 'string' ? confirm : '确认'}
          </Button>
        </If>
      </div>
      <div className="m78-action-sheet_item-cont">{renderItems()}</div>
      <If when={!confirm}>
        <div
          className="m78-action-sheet_item m78-effect m78-hb-t __md __cancel"
          onClick={() => close()}
        >
          取消
        </div>
      </If>
    </Drawer>
  );
}

type ActionSheetOption = Omit<ActionSheetProps<any>, 'show' | 'defaultShow'>;

const actionSheetApi = createRenderApi<ActionSheetOption>(_ActionSheet, {
  namespace: 'ACTION_SHEET',
});

type ActionSheet = typeof _ActionSheet;

interface ActionSheetWithApi extends ActionSheet {
  api: typeof actionSheetApi;
}

const ActionSheet: ActionSheetWithApi = Object.assign(_ActionSheet, { api: actionSheetApi });

const options = [
  {
    label: '操作1',
    value: 1,
  },
  {
    label: '高亮操作',
    value: 2,
    desc: '对此操作的详细描述',
    highlight: true,
  },
  {
    label: '禁用',
    value: 3,
    disabled: true,
  },
  {
    label: '操作4',
    value: 4,
  },
];

export default function Fff() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <ActionSheet<number>
        defaultValue={2}
        onClose={(v, item) => {
          console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
          item && console.log('选项为:', item);
        }}
        options={options}
        triggerNode={<Button>常规使用</Button>}
      />

      <ActionSheet<number>
        confirm={false}
        onClose={(v, item) => {
          console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
          item && console.log('选项为:', item);
        }}
        options={options}
        triggerNode={<Button>直接选中模式</Button>}
      />

      <Button onClick={() => setShow(true)}>手动控制show</Button>
      <ActionSheet<number>
        show={show}
        onShowChange={nShow => setShow(nShow)}
        onClose={(v, item) => {
          console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
          item && console.log('选项为:', item);
        }}
        options={options}
      />

      <Button
        onClick={() => {
          ActionSheet.api({
            defaultValue: 2,
            options,
            /** TODO: react-render-api 回传参数 */
            onClose(v, item) {
              console.log(v, item);

              console.log(v ? `选中值: ${v}` : '关闭了ActionSheet');
              item && console.log('选项为:', item);
            },
          });
        }}
      >
        通过api调用
      </Button>
    </div>
  );
}
