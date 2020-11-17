import React from 'react';
import { UseQueueItem } from '@lxjx/hooks';
import { TipsItem, TipsProps } from './type';
declare function Tips({ controller: queue }: TipsProps): JSX.Element;
declare namespace Tips {
    var useTipsController: any;
    var push: (opt: MixItem | MixItem[]) => void;
    var tip: (message: React.ReactNode, duration?: number) => void;
}
declare type MixItem = UseQueueItem & TipsItem;
export default Tips;
