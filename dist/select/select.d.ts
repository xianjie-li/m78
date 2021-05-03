/// <reference types="react" />
import { SelectProps } from './type';
declare function Select<ValType = string, Options = any>(props: SelectProps<ValType, Options>): JSX.Element;
declare namespace Select {
    var displayName: string;
}
export default Select;
