<div align="center">

# fdb 

<a href="#">
  <img src="https://img.shields.io/badge/npm-1.0.0-blue">  
</a>

> Simple file-based key-value storage
 
</div>

# Import
```ts
// ESM
import fdb from "fdb";

// CJS
const fdb = require('fdb')
```
```ts
const db = new fdb(/* path to config */)

await db.set('key', 'value')

const value = await db.get('key') // value
```