import { FlatMetas, Share } from './types';
export declare function useMethods(share: Share): {
    isShow: (item: FlatMetas) => boolean;
    openAll: () => void;
    openToZ: (z: number) => void;
    getSelfAndDescendants: (item: FlatMetas) => (string | number)[];
    getSelfAndParents: (item: FlatMetas) => (string | number)[];
    getSize: () => {
        itemHeight: number;
        identWidth: number;
    };
    getShowList: (list: FlatMetas[], keyword?: string | undefined) => FlatMetas[];
    scrollHandle: () => void;
    keywordChangeHandle: (keyword: any) => void;
    syncParentsChecked: (item: FlatMetas, checked?: boolean | undefined) => void;
    getSelfAndDescendantsItem: (item: FlatMetas) => FlatMetas[];
};
