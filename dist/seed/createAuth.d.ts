import React from 'react';
import { Seed } from '@m78/seed';
import { ExpandSeed } from './type';
export declare function createAuth<D, V>(seed: Seed<D, V>, useAuth: ExpandSeed<D, V>['useAuth']): React.FC<import("./type").AuthProps<D, V>>;
