import React from 'react';
import { useForm } from 'm78/form';
import { required } from '@m78/verify';
import { RadioBox } from 'm78/radio-box';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const Valid = () => {
  const Form = useForm();

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div>
      <Form.Field
        name="opt"
        label="选项"
        validator={[required()]}
        extra={
          <div>
            <div>选择不同选项来显示不同的控件, 无效的控件不参与验证和提交</div>
          </div>
        }
      >
        <RadioBox
          options={[
            {
              label: '表单1',
              value: '1',
            },
            {
              label: '表单2',
              value: '2',
            },
            {
              label: '表单3',
              value: '3',
            },
          ]}
        />
      </Form.Field>

      <Form.Field
        name="f111"
        label="表单111"
        validator={[required()]}
        deps={['opt']}
        valid={form => form.getValue('opt') === '1'}
      >
        <Input placeholder="输入表单1的内容" />
      </Form.Field>

      <Form.Field
        name="f222"
        label="表单222"
        validator={[required()]}
        deps={['opt']}
        valid={form => form.getValue('opt') === '2'}
      >
        <Input placeholder="输入表单2的内容" />
      </Form.Field>

      <Form.Field
        name="f333"
        label="表单333"
        validator={[required()]}
        deps={['opt']}
        valid={form => form.getValue('opt') === '3'}
      >
        <Input placeholder="输入表单3的内容" />
      </Form.Field>

      <Button color="primary" onClick={Form.submit}>
        提交
      </Button>
      <Button onClick={Form.reset}>重置</Button>
    </div>
  );
};

export default Valid;
