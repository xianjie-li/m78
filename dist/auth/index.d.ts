import 'm78/auth/style';
import cacheMiddleware from '@lxjx/auth/cacheMiddleware';
import create from './auth';
export { Validator, Action, ValidMeta, PromiseBack, Middleware } from '@lxjx/auth';
export { cacheMiddleware };
export { AuthTypeEnum } from './type';
export default create;
