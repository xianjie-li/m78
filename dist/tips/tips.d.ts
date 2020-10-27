import React from 'react';
import { UseQueueConfig, UseQueueItem, UseQueueItemWithId } from '@lxjx/hooks';
import { TipsItem, TipsProps } from './type';
declare function Tips({ controller: queue }: TipsProps): JSX.Element;
declare namespace Tips {
    var useTipsController: (opt?: UseQueueConfig<TipsItem> | undefined) => {
        push: (opt: (TipsItem & UseQueueItem) | (TipsItem & UseQueueItem)[]) => void;
        prev: () => void;
        next: () => void;
        hasNext: (id?: string | undefined) => boolean;
        hasPrev: (id?: string | undefined) => boolean;
        clear: () => void;
        findIndexById: (id: string) => number;
        isPause: boolean;
        current: (TipsItem & UseQueueItemWithId) | null;
        start: () => void;
        pause: () => void;
        list: (TipsItem & UseQueueItemWithId)[];
        index: number | null;
    };
    var push: (opt: MixItem | MixItem[]) => void;
    var tip: (message: React.ReactNode, duration?: number | undefined) => void;
}
declare type MixItem = UseQueueItem & TipsItem;
export default Tips;
