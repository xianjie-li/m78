import React from 'react';
import { Auth } from '@lxjx/auth';
import { ExpandAuth } from './type';
export declare function createAuth<D, V>(auth: Auth<D, V>, useAuth: ExpandAuth<D, V>['useAuth']): React.FC<import("./type").AuthProps<D, V>>;
