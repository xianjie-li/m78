import { TableDivideStyleEnum } from 'm78/table/types';
import { isTruthyOrZero } from '@lxjx/utils';

export const defaultProps = {
  dataSource: [],
  columns: [],
  primaryKey: '',
  divideStyle: TableDivideStyleEnum.regular,
  stripe: true,
  loading: false,
  cellMaxWidth: '300px',
  checkFieldValid: isTruthyOrZero,
};
