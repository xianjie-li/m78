/// <reference types="react" />
import { DNDProps } from './types';
declare function DND<Data = any, TData = Data>(props: DNDProps<Data, TData>): JSX.Element;
declare namespace DND {
    var defaultProps: {
        enableDrag: boolean;
        enableDrop: boolean;
    };
}
export default DND;
