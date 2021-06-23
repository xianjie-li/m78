import { defaultProps } from 'm78/table/common';
import { useStates } from 'm78/table/useStates';
import { useEffects } from 'm78/table/useEffects';
import { TreeBasePropsMix } from 'm78/tree';
import { useTreeStates } from 'm78/tree/use-tree-states';
import { useTreeLifeCycle } from 'm78/tree/life-cycle';
import { _Context, TablePropsMultipleChoice, TablePropsSingleChoice, TableTreeNode } from './types';
import { render } from './renders';

function Table(props: TablePropsSingleChoice): JSX.Element;
function Table(props: TablePropsMultipleChoice): JSX.Element;
function Table(props: TablePropsSingleChoice | TablePropsMultipleChoice) {
  const treeState = useTreeStates<TableTreeNode>(props as TreeBasePropsMix);

  const states = useStates(props, treeState);

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
