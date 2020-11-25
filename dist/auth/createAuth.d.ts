import React from 'react';
import { Auth } from '@lxjx/auth';
import { AuthProps, ExpandAuth } from './type';
export declare function createAuth<D, V>(auth: Auth<D, V>, useAuth: ExpandAuth<D, V>['useAuth']): React.FC<AuthProps<D, V>>;
