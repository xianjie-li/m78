import 'm78/seed/style';
import cacheMiddleware from '@m78/seed/cacheMiddleware';
import devtoolMiddleware from '@m78/seed/devtoolMiddleware';
import create from './seedImpl';

export { Validator, Action, ValidMeta, Middleware } from '@m78/seed';
export { cacheMiddleware, devtoolMiddleware };
export { AuthTypeEnum } from './type';
export default create;

/*
 * TODO: deps => ({ ...deps.xxx })这种形式使用是否会浪费性能?
 * */
