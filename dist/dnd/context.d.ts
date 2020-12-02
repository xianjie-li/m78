/// <reference types="react" />
import { DNDContextValue, DNDRelationContext } from './types';
declare const defaultContext: DNDContextValue;
declare const context: import("react").Context<DNDContextValue>;
declare const relationContext: import("react").Context<DNDRelationContext>;
export { defaultContext, relationContext };
export default context;
