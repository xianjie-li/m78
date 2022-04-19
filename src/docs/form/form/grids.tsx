import React from 'react';
import { GridsColProps, Grids, GridsItem } from 'm78/layout';
import { useForm } from 'm78/form';
import { Input } from 'm78/input';
import { Button } from 'm78/button';

const layout: GridsColProps = {
  xs: 12,
  lg: 12 / 2,
  xxl: 12 / 3,
};

const GridsDemo = () => {
  const Form = useForm({
    maxWidth: '100%',
  });

  Form.submitEvent.useEvent(values => {
    alert(JSON.stringify(values, undefined, 4));
  });

  return (
    <div style={{ border: '1px solid pink', position: 'relative', padding: 12 }}>
      <Grids gutter={[0, 12]}>
        {Array.from({ length: 20 }).map((_, index) => (
          <GridsItem key={index} {...layout}>
            <Form.Field name={`field${index + 1}`} label={`字段${index + 1}`}>
              <Input placeholder="输入内容" />
            </Form.Field>
          </GridsItem>
        ))}
      </Grids>

      <div className="p-12">
        <Button color="primary" onClick={Form.submit}>
          提交
        </Button>
        <Button onClick={Form.reset}>重置</Button>
      </div>
    </div>
  );
};

export default GridsDemo;
