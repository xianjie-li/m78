// @ts-nocheck
import { Plugin } from 'C:/main/git/m78/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['modifyClientRenderOpts','patchRoutes','rootContainer','render','onRouteChange',],
});
plugin.register({
  apply: require('C:/main/git/m78/src/app.tsx'),
  path: 'C:/main/git/m78/src/app.tsx',
});

export { plugin };
