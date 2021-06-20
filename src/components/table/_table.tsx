import { defaultProps } from 'm78/table/common';
import { useStates } from 'm78/table/useStates';
import { useEffects } from 'm78/table/useEffects';
import { _Context, TableProps } from './types';
import { render } from './renders';

const _Table = (props: TableProps) => {
  const ctx: _Context = {
    states: useStates(props),
    props: props as _Context['props'],
  };

  useEffects(ctx);

  return render(ctx);
};

_Table.defaultProps = defaultProps;

export default _Table;
