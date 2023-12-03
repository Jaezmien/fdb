import { mkdir, rm, writeFile, readFile, existsSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import NodeCache from 'node-cache';

const mkdirAsync = promisify(mkdir);
const rmAsync = promisify(rm);
const writeFileAsync = promisify(writeFile);
const readFileAsync = promisify(readFile);
function FDB(configPath = ".") {
  const cache = new NodeCache({ stdTTL: 100, checkperiod: 600 });
  function HasKey(key) {
    return existsSync(join(configPath, key)) && key.trim().length > 0;
  }
  async function SetKey(key, value) {
    if (!value.trim()) {
      return RemoveKey(key);
    }
    if (!existsSync(configPath)) {
      await mkdirAsync(configPath);
    }
    await writeFileAsync(join(configPath, key), value);
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
    return await readFileAsync(join(configPath, key), "utf8");
  }
  async function RemoveKey(key) {
    if (!HasKey(key)) {
      return;
    }
    await rmAsync(join(configPath, key));
    cache.del(key);
  }
  return {
    get: GetKey,
    set: SetKey,
    remove: RemoveKey
  };
}

export { FDB as default };
