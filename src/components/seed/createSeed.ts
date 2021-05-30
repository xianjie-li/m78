import create, { CreateSeedConfig } from '@m78/seed';
import { RCSeed, RCSeedCreator } from './types';
import { insideMiddleware } from './middleware';

export const _CreateSeed: RCSeedCreator = conf => {
  const middleware: CreateSeedConfig['middleware'] = [insideMiddleware];

  if (conf?.middleware?.length) {
    middleware.push(...conf.middleware);
  }

  return create({
    middleware,
    ...conf,
  }) as RCSeed<any>;
};
