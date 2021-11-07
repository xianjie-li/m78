import React from 'react';
import { Row } from 'm78/layout';
import { RadioBox } from 'm78/radio-box';
import { Table, TableColumns, TableDivideStyleEnum } from 'm78/table';
import { SizeEnum } from 'm78/types';
import { Check } from 'm78/check';
import { useSetState } from '@lxjx/hooks';
import { dataSource } from './dataSource';

const columns: TableColumns = [
  {
    label: '卡号',
    field: 'id',
  },
  {
    label: '名称',
    field: 'name',
  },
  {
    label: '日文名',
    field: 'jName',
  },
  {
    label: '种族',
    field: 'race',
  },
  {
    label: '属性',
    field: 'property',
  },
  {
    label: '级别',
    field: 'level',
  },
  {
    label: '攻',
    field: 'atk',
  },
  {
    label: '防',
    field: 'def',
  },
];

const StyleDemo = () => {
  const [state, setState] = useSetState({
    divideStyle: TableDivideStyleEnum.regular,
    size: (undefined as unknown) as SizeEnum | undefined,
    stripe: true,
  });

  return (
    <div>
      <Row crossAlign="center">
        <span className="mr-8">分割风格: </span>
        <RadioBox
          size="small"
          options={[
            {
              label: '常规',
              value: TableDivideStyleEnum.regular,
            },
            {
              label: '边框',
              value: TableDivideStyleEnum.border,
            },
          ]}
          value={state.divideStyle}
          onChange={divideStyle => {
            setState({ divideStyle });
          }}
        />
      </Row>

      <Row crossAlign="center">
        <span className="mr-8">尺寸: </span>
        <RadioBox
          size="small"
          options={[
            {
              label: '常规',
              value: undefined,
            },
            {
              label: '小',
              value: SizeEnum.small,
            },
            {
              label: '大',
              value: SizeEnum.large,
            },
          ]}
          value={state.size}
          onChange={size => {
            setState({ size });
          }}
        />
      </Row>

      <Row crossAlign="center">
        <span className="mr-8">条纹背景: </span>
        <Check
          size="small"
          type="switch"
          checked={state.stripe}
          onChange={check => {
            setState({
              stripe: check,
            });
          }}
        />
      </Row>

      <div className="mt-24">
        <Table {...state} columns={columns} dataSource={dataSource} />
      </div>
    </div>
  );
};

export default StyleDemo;
