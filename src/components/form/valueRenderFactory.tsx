import { useUpdate } from '@lxjx/hooks';
import { useEffect } from 'react';
import { RForm, ValueRenderProps } from './types';

export function valueRenderFactory(form: RForm) {
  return function ValueRender({ name, children }: ValueRenderProps) {
    const update = useUpdate();

    const val = form.getValue(name);

    form.changeEvent.useEvent(changes => {
      // 相关field更新后更新组件
      if (form.listIncludeNames([name], changes)) {
        update();
      }
    });

    useEffect(() => {
      if (form.getValue(name) !== val) {
        update();
      }
    }, []);

    return children(val);
  };
}
