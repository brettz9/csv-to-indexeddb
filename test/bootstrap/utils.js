const {readdir: rd, unlink: ul} = require('fs');
const {join} = require('path');
const {promisify} = require('util');

const unlink = promisify(ul);
const readdir = promisify(rd);

// eslint-disable-next-line promise/prefer-await-to-callbacks
exports.getSuccess = function getSuccess (req, cb) {
  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    req.addEventListener('success', ({target: {result}}) => {
      // eslint-disable-next-line max-len
      // eslint-disable-next-line node/callback-return, promise/prefer-await-to-callbacks
      cb(result);
      resolve();
    });
    req.addEventListener('error', () => {
      reject(new Error('`error` event'));
    });
    req.addEventListener('blocked', () => {
      reject(new Error('`blocked` event'));
    });
  });
};

exports.cleanupDatabases = async function () {
  const basePath = join(__dirname, '../../');
  const dirs = await readdir(basePath);
  dirs.filter((fn) => {
    return fn.endsWith('.sqlite');
  }).forEach(async (fn) => {
    const filePath = join(basePath, fn);
    await unlink(filePath);
    // console.log('Removed file at', filePath);
  });
};
