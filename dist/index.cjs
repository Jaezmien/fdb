'use strict';

const node_fs = require('node:fs');
const node_path = require('node:path');
const node_util = require('node:util');
const NodeCache = require('node-cache');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const NodeCache__default = /*#__PURE__*/_interopDefaultCompat(NodeCache);

const mkdirAsync = node_util.promisify(node_fs.mkdir);
const rmAsync = node_util.promisify(node_fs.rm);
const writeFileAsync = node_util.promisify(node_fs.writeFile);
const readFileAsync = node_util.promisify(node_fs.readFile);
function FDB(configPath = ".") {
  const cache = new NodeCache__default({ stdTTL: 100, checkperiod: 600 });
  function HasKey(key) {
    return node_fs.existsSync(node_path.join(configPath, key)) && key.trim().length > 0;
  }
  async function SetKey(key, value) {
    if (!value.trim()) {
      return RemoveKey(key);
    }
    if (!node_fs.existsSync(configPath)) {
      await mkdirAsync(configPath);
    }
    await writeFileAsync(node_path.join(configPath, key), value);
    cache.set(key, value);
  }
  async function GetKey(key) {
    if (!HasKey(key)) {
      return void 0;
    }
    const cachedValue = cache.get(key);
    if (cachedValue) {
      return cachedValue;
    }
    return await readFileAsync(node_path.join(configPath, key), "utf8");
  }
  async function RemoveKey(key) {
    if (!HasKey(key)) {
      return;
    }
    await rmAsync(node_path.join(configPath, key));
    cache.del(key);
  }
  return {
    get: GetKey,
    set: SetKey,
    remove: RemoveKey
  };
}

module.exports = FDB;
