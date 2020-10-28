/** 
 * 发布成功后同步dist下的package.json.version到根目录
 */

 const path = require('path');
 const fs = require('fs');

 const distPkg = require('../dist/package.json');

 const rootPkg = require('../package.json');

 console.log(distPkg.version);

 rootPkg.version = distPkg.version;
 
fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(rootPkg, null, 2));

