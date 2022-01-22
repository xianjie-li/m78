import React from 'react';
import { useForm } from 'm78/form';
import { required, string } from '@m78/verify';
import { Input } from 'm78/input';
import { Row, Spacer } from 'm78/layout';
import { Button } from 'm78/button';

const Nest = () => {
  const Form = useForm();

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div style={{ width: 440 }}>
      <Form.Field name="name" label="收货人" validator={[required(), string({ min: 2 })]}>
        <Input placeholder="输入收货人" />
      </Form.Field>
      <Row>
        <Spacer width={16}>
          <Form.Field name={['address', 'country']} label="国家" validator={[required()]}>
            <Input placeholder="输入国家" />
          </Form.Field>
          <Form.Field name={['address', 'city']} label="城市" validator={[required()]}>
            <Input placeholder="输入城市" />
          </Form.Field>
        </Spacer>
      </Row>

      <Row>
        <Spacer width={16}>
          <Form.Field name={['number', '0']} label="号码" validator={[required()]}>
            <Input placeholder="输入号码" />
          </Form.Field>
          <Form.Field name={['number', '1']} label="备用号码" validator={[required()]}>
            <Input placeholder="输入备用号码" />
          </Form.Field>
        </Spacer>
      </Row>

      <Button color="primary" onClick={Form.submit}>
        提交
      </Button>
      <Button onClick={Form.reset}>重置</Button>
    </div>
  );
};

export default Nest;
