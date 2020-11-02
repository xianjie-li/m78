import 'm78/fork/style';
import InternalFork, { If, Toggle, Switch } from './fork';
declare type ForkType = typeof InternalFork;
interface Fork extends ForkType {
    If: typeof If;
    Toggle: typeof Toggle;
    Switch: typeof Switch;
}
declare const Fork: Fork;
export * from './type';
export * from './fork';
export default Fork;