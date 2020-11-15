import React, { useRef, useState } from 'react';
import Tree from 'm78/tree';
import { SizeEnum } from 'm78/types';
import { OptionsItem } from 'm78/tree/types';
import { getRandRange } from '@lxjx/utils';
import { RightOutlined, FileOutlined } from 'm78/icon';
import Dates from 'm78/dates/Dates';
import NoticeBar from 'm78/notice-bar';
import Input from 'm78/input';
import { useFetch } from '@lxjx/hooks';
import Fork from 'm78/fork';
import Button from 'm78/button';
import Form, { FormRenderChild, useForm } from 'm78/form';
import { FormInstance } from 'rc-field-form';

function mockTreeData(length: number, z: number, label = '选项') {
  const ls: OptionsItem[] = [];

  function gn(list: OptionsItem = [], vp: string, cZInd = 0) {
    Array.from({ length }).forEach((_, index) => {
      const v = vp ? `${vp}-${index + 1}` : String(index + 1);
      const children: OptionsItem[] = [];

      const current: OptionsItem = {
        label: `${label} ${v}`,
        value: v,
        children: Math.random() > 0.5 ? [] : undefined,
      };

      list.push(current);

      if (cZInd !== z) {
        current.children = children;
        gn(children, v, cZInd + 1);
      }
    });
  }

  gn(ls, '');

  return ls;
}

const opt = mockTreeData(5, 5);

const customRender: FormRenderChild = (control, meta) => {
  return (
    <div>
      <div>
        <span>{meta.required && '*'}</span>
        <input type="text" {...control} disabled={meta.disabled} />
      </div>
      <div>{meta.errorString}</div>
    </div>
  );
};

const Play = () => {
  const [form] = useForm();

  const ref = useRef<FormInstance>(null!);

  console.log(form, ref);

  return (
    <div>
      <Form
        notBorder
        instanceRef={ref}
        form={form}
        initialValues={{
          f1: '',
          f2: 'heheda',
        }}
        onFinish={val => {
          console.log(val);
        }}
      >
        <Form.Item name="f1" required len={5}>
          <Input />
        </Form.Item>
        <Form.Item name="f2">
          <Input />
        </Form.Item>
        <Form.Item name="f3">
          <Input />
        </Form.Item>
        <button type="submit">submit</button>
        <button type="reset">reset</button>
      </Form>
      <Tree
        size={SizeEnum.large}
        multipleCheckable
        defaultValue={['1-1-1-1-1-1']}
        rainbowIndicatorLine
        onChange={(a, b) => {
          console.log('change', a, b);
        }}
        dataSource={opt}
        height={400}
        toolbar
      />
    </div>
  );
};

export default Play;
