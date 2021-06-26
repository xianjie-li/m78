import { TreeBasePropsMix, useTreeStates } from 'm78/tree';
import { useTreeLifeCycle } from 'm78/tree/life-cycle';
import { defaultProps } from './_common';
import { _useStates } from './_useStates';
import { useEffects } from './_useEffects';
import {
  _Context,
  TablePropsMultipleChoice,
  TablePropsSingleChoice,
  TableTreeNode,
} from './_types';
import { render } from './_renders';

function Table(props: TablePropsSingleChoice): JSX.Element;
function Table(props: TablePropsMultipleChoice): JSX.Element;
function Table(props: TablePropsSingleChoice | TablePropsMultipleChoice) {
  const treeState = useTreeStates<TableTreeNode>(props as TreeBasePropsMix);

  const states = _useStates(props, treeState);

  const ctx: _Context = {
    states,
    props: props as _Context['props'],
    treeState,
  };

  useTreeLifeCycle(props, ctx.treeState, false);

  useEffects(ctx);

  return render(ctx);
}

Table.defaultProps = defaultProps;

export default Table;
