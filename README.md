**DEPRECATED REPO!!! Moved to https://github.com/gratex/uri**
<br><br>

[![Build Status](https://travis-ci.org/gratex/uri.svg?branch=readme)](https://travis-ci.org/gratex/uri)
[![npm](https://img.shields.io/npm/dm/@gjax/uri.svg)](https://www.npmjs.com/package/@gjax/uri)
![NodeVersion](https://img.shields.io/node/v/@gjax/uri.svg)
![npm type definitions](https://img.shields.io/npm/types/@gjax/uri.svg)
[![Coverage Status](https://coveralls.io/repos/github/gratex/uri/badge.svg?branch=readme)](https://coveralls.io/github/gratex/uri?branch=readme)

# Convenient uri API


## Install
Node module, so use:

```
npm install --save @gjax/uri
```

## Usage

```
const {uri, uri, uriBuilder} = require('@gjax/uri'); // RESULT: Load the full build.
```
```
const res = uri.decomposeComponents('http://a/b/c/d;p?q'); // RESULT: Object with certain property values.  
const res2 = Uri.equalsQueryStr('type=animal&name=narwhal', 'name=narwhal&type=animal'); // RESULT : TRUE  
const p1 = 'a/b?c', p2 = 'a#b', p3 = 'a b';  
const url = uriBuilder`/foo/${p1}/bar/?x=${p2}#/baz/${p3}`; // RESULT: /foo/a%2Fb%3Fc/bar/?x=a%23b#/baz/a%20b 
```

## Documentation
[API Documentation](http://gratex.github.io/uri/doc/api/index.html)