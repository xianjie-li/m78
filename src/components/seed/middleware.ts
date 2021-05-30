import { Middleware } from '@m78/seed';
import { _createUseState } from './createUseState';
import { _createState } from './createState';

export const insideMiddleware: Middleware = bonus => {
  if (bonus.init) {
    return bonus.config;
  }

  const useState = _createUseState(bonus.apis);
  (bonus.apis as any).useState = useState;
  (bonus.apis as any).State = _createState(bonus.apis, useState);
};
