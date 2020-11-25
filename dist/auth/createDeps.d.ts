import { Auth } from '@lxjx/auth';
import { Deps, UseDeps } from './type';
declare function createDeps<D, V>(auth: Auth<D, V>, useDeps: UseDeps<D>): Deps<D>;
export default createDeps;
