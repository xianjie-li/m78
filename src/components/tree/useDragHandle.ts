import { useFn } from '@lxjx/hooks';
import { BeforeCapture } from 'react-beautiful-dnd';
import { splitValueIndexJointString } from './common';
import { Share, TreeNode } from './types';
import { useMethods } from './methods';

export function useDragHandle(
  share: Share,
  methods: ReturnType<typeof useMethods>,
  showList: TreeNode[],
) {
  const { openCheck } = share;

  const beforeDragHandle = useFn((before: BeforeCapture) => {
    const infos = splitValueIndexJointString(before.draggableId);

    if (!infos) return;

    const [, index] = infos;

    const current = showList[index];

    if (!current) return;

    openCheck.unCheckList(methods.getSelfAndDescendants(current));
  });

  return {
    beforeDragHandle,
  };
}
