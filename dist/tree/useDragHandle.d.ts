import { BeforeCapture } from 'react-beautiful-dnd';
import { Share, TreeNode } from './types';
import { useMethods } from './methods';
export declare function useDragHandle(share: Share, methods: ReturnType<typeof useMethods>, showList: TreeNode[]): {
    beforeDragHandle: (before: BeforeCapture) => void;
};
