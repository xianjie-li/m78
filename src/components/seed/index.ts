import 'm78/seed/style';
import cacheMiddleware from '@m78/seed/cacheMiddleware';
import devtoolMiddleware from '@m78/seed/devtoolMiddleware';
import create from './seedImpl';

export * from '@m78/seed';
export { cacheMiddleware, devtoolMiddleware };
export { AuthTypeEnum } from './type';
export default create;
