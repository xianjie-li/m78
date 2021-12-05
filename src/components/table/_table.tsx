import { TreeBasePropsMix, useTreeStates } from 'm78/tree';
import { useTreeLifeCycle } from 'm78/tree/life-cycle';
import { SizeEnum } from 'm78/common';
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

  const treeState = useTreeStates<TableTreeNode>(props as TreeBasePropsMix, isVirtual, {
    size: getSizeNumber(props.size as SizeEnum),
    height: isNumber(height) ? height : undefined,
    space: tableHeaderHeight,
  });

  const states = _useStates(props);

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
