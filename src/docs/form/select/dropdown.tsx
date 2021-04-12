import React from 'react';
import Select, { SelectOptionItem } from 'm78/select';
import Button from 'm78/button';
import { CaretDownOutlined } from 'm78/icon';
import { PopperDirectionEnum } from 'm78/popper';

const opt: SelectOptionItem[] = [
  {
    value: '首页',
    prefix: '😀',
  },
  {
    value: '购物车',
    prefix: '🥰',
  },
  {
    value: '关于我们',
    prefix: '🥵',
  },
  {
    value: '个人中心',
    prefix: '🥴',
  },
];

const Dropdown = () => {
  return (
    <div>
      <Select
        value="" /* 使值不会被选中 */
        onChange={val => {
          console.log(val);
        }}
        options={opt}
      >
        <Button text color="primary">
          请选择内容
          <CaretDownOutlined className="fs-lg" />
        </Button>
      </Select>

      <Select
        value=""
        onChange={val => {
          console.log(val);
        }}
        options={opt}
        arrow
        direction={PopperDirectionEnum.bottom}
      >
        <Button text color="primary">
          自定义位置+气泡
          <CaretDownOutlined className="fs-lg" />
        </Button>
      </Select>
    </div>
  );
};

export default Dropdown;
