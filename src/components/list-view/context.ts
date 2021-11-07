import { createContext } from 'react';
import { ListViewProps } from './types';

export default createContext<Omit<ListViewProps, 'children'>>({});
