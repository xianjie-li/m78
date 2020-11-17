import React from 'react';
import { Auth } from '@lxjx/auth';
import { AuthProps } from './type';
export declare function createAuth<D, V>(auth: Auth<D, V>): React.FC<AuthProps<D, V>>;
