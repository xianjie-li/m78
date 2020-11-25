import { TreeNode, Share } from './types';
export declare function useMethods(share: Share): {
    isShow: (item: TreeNode) => boolean;
    openAll: () => void;
    openToZ: (z: number) => void;
    getSelfAndDescendants: (item: TreeNode) => (string | number)[];
    getSelfAndParents: (item: TreeNode) => (string | number)[];
    getSize: () => {
        itemHeight: number;
        identWidth: number;
    };
    getShowList: (list: TreeNode[], keyword?: string | undefined) => TreeNode[];
    scrollHandle: () => void;
    keywordChangeHandle: (keyword: any) => void;
    syncParentsChecked: (item: TreeNode, checked?: boolean | undefined) => void;
    getSelfAndDescendantsItem: (item: TreeNode) => TreeNode[];
};
