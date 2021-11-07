import 'm78/fork/style';
import InternalFork, { If, Toggle, Switch } from './fork-impl';

type ForkType = typeof InternalFork;

interface Fork extends ForkType {
  If: typeof If;
  Toggle: typeof Toggle;
  Switch: typeof Switch;
}

const Fork: Fork = InternalFork as Fork;

Fork.If = If;
Fork.Toggle = Toggle;
Fork.Switch = Switch;

export * from './type';
export * from './fork-impl';
export { Fork };
