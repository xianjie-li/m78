import React from 'react';
import { m78Config } from 'm78/config';
import { Divider, Grids, GridsItem } from 'm78/layout';
import { Button } from 'm78/button';

import './style.scss';

import { Form, FormItem } from 'm78/form';
import { Input } from 'm78/input';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Form fullWidth>
        <Grids>
          <GridsItem xs={12} md={6} xl={4} xxl={3}>
            <FormItem label="表单1">
              <Input placeholder="请输入" />
            </FormItem>
          </GridsItem>
          <GridsItem xs={12} md={6} xl={4} xxl={3}>
            <FormItem label="表单2">
              <Input placeholder="请输入" />
            </FormItem>
          </GridsItem>
          <GridsItem xs={12} md={6} xl={4} xxl={3}>
            <FormItem label="表单3">
              <Input placeholder="请输入" />
            </FormItem>
          </GridsItem>
          <GridsItem xs={12} md={6} xl={4} xxl={3}>
            <FormItem label="表单4">
              <Input placeholder="请输入" />
            </FormItem>
          </GridsItem>
        </Grids>
      </Form>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
