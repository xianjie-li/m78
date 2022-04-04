import React, { useMemo, useState } from 'react';
import { defer, omit, TupleNumber } from '@lxjx/utils';
import { useTrigger, UseTriggerType } from 'm78/hooks';
import { Overlay, OverlayDirection } from 'm78/overlay';
import clsx from 'clsx';
import { useFormState } from '@lxjx/hooks';
import { TransitionType } from 'm78/transition';
import { ContextMenuProps, omitContextMenuOverlayProps } from './types';

const defaultTriggerType = [UseTriggerType.contextMenu];

const _ContextMenu = (props: ContextMenuProps) => {
  const { content, children, triggerType = defaultTriggerType } = props;

  const overlayProps = useMemo(() => {
    return omit(props, [...(omitContextMenuOverlayProps as any), 'children']);
  }, [props]);

  const [xy, setXY] = useState<TupleNumber>([0, 0]);
  const [show, setShow] = useFormState(props, false, {
    valueKey: 'show',
    defaultValueKey: 'defaultShow',
  });

  const { node } = useTrigger({
    element: children,
    type: triggerType,
    onTrigger(e) {
      e.nativeEvent.stopPropagation();

      setXY([e.x, e.y]);

      defer(() => setShow(true));
    },
  });

  return (
    <>
      {node}
      <Overlay
        mountOnEnter
        unmountOnExit
        direction={OverlayDirection.rightStart}
        {...overlayProps}
        xy={xy}
        show={show}
        onChange={setShow}
        transitionType={TransitionType.fade}
        content={
          <div
            className={clsx('m78-context-menu')}
            onClick={() => setShow(false)}
            onContextMenu={e => e.preventDefault()}
          >
            {content}
          </div>
        }
      />
    </>
  );
};

export { _ContextMenu };
