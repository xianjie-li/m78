import { TreeBasePropsMix, useTreeStates, useTreeLifeCycle } from 'm78/tree';
import { Size } from 'm78/common';
import { isNumber } from '@lxjx/utils';
import { defaultProps, tableHeaderHeight } from './_common';
import { _useStates } from './_useStates';
import { useEffects } from './_useEffects';
import {
  _Context,
  TablePropsMultipleChoice,
  TablePropsSingleChoice,
  TableTreeNode,
} from './_types';
import { render } from './_renders';
import { getSizeNumber } from './_functions';

function Table(props: TablePropsSingleChoice): JSX.Element;
function Table(props: TablePropsMultipleChoice): JSX.Element;
function Table(props: TablePropsSingleChoice | TablePropsMultipleChoice) {
  const { height } = props;

  /** 是否开启虚拟滚动 */
  const isVirtual = !!height;

  /** 经过内部化处理的columns，应优先使用此变量代替传入的column */
  const states = _useStates(props);

  const treeState = useTreeStates<TableTreeNode>(props as TreeBasePropsMix, isVirtual, {
    size: getSizeNumber(props.size as Size),
    height: isNumber(height) ? height : undefined,
    space: states.fmtColumns.max * tableHeaderHeight,
  });

  const ctx: _Context = {
    states,
    isVirtual,
    props: props as _Context['props'],
    treeState,
  };

  useTreeLifeCycle(props as TreeBasePropsMix, ctx.treeState, false);

  useEffects(ctx);

  return render(ctx);
}

Table.defaultProps = defaultProps;

export default Table;
