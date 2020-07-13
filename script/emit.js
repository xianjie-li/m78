const cpExec = require('child_process').exec;

module.exports.exec = function exec(cmd) {
  return new Promise((resolve, reject) => {
    cpExec(cmd, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
