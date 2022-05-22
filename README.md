# Path-RegExp

这是相对社区流行的 URL 路径转换为正则的另一种实现方式，非常的轻量快速，借鉴了`regexparam`和`path-to-regexp`部分功能特性，使用`{}`而非`:`作为提取声明方式，原因是`:`声明提取必须基于`/`的结尾或分割，而使用`{}`就没有这个烦恼，并且更直观。

🐂 已支持的匹配规则：

- RegExp (`/(.\*)/g`)
- Wildcards (`{*}`, `/books/{*}`, `/books/{genre}/{*}`)
- Parameter (`/books/{id}`, `/books/{cId}/{title}`, `/books/book-{cid}-{uid}`)
- Cutout Parameter (`/{@:user}/article-{cid}-{uid}-{id}-{pid}`)
- Optional Parameter (`/books/{cId}{/:title}?`, `/books/{cId}{/:title}?/{tag}`)
- Parameter w/ Suffix (`/{pkg}/download/{filename}.tgz`, `/{pkg}/download/{filename}.(tgz|tar.gz)`)

## Installation

```
$npm install path-regexp --save-dev
```

## Getting Started

```
$ npm install path-regexp --save
```

is examples:

```
import { parse } from 'path-regexp'

const pick = (tpl) => {
  const re = parse(tpl)
  return (path) => {
    const matches = re.pattern.exec(path)
    return (
      matches &&
      re.keys.reduce((params, key, i) => {
        params[key] = matches[++i] || null
        return params
      }, {})
    )
  }
}

const result = parse('/books/{cId}/{title}')
result.pattern.test('/books/123/abc') //=> true

const get = pick('/books/{cId}/{title}')
console.log(get('/books/123/abc')) //=> { cId: '123', title: 'abc' }
```

## Benchmarks

在 Node `v16.13.0` 上使用 `benchmark.js` 测试他的性能表现。

使用以下命令获得结果：

```
$ npm run bench
```

Result:

```
Test regexp x 59,580,873 ops/sec ±1.39% (89 runs sampled)
Test wildcards x 3,208,251 ops/sec ±0.36% (95 runs sampled)
Test parameter x 908,722 ops/sec ±0.80% (96 runs sampled)
Test cutout parameter x 827,645 ops/sec ±0.63% (93 runs sampled)
Test optional parameter x 838,679 ops/sec ±0.26% (96 runs sampled)
Test w/ suffix parameter x 875,957 ops/sec ±0.59% (98 runs sampled)
Fastest is Test regexp
Slowest is Test cutout parameter
```

## Tests

```
> jest --collect-coverage && open ./coverage/lcov-report/index.html

 PASS  src/index.test.js
  ✓ test regexp parameter: /(.*)/g (1 ms)
  ✓ test wildcards path: {*} -> /books (1 ms)
  ✓ test wildcards path: /books/{*} -> /books/horror/goosebumps (1 ms)
  ✓ test loose path: /books -> /books/123
  ✓ test loose path: /books/{id} -> /books/123/title
  ✓ test parameter path: /books/{id} -> /books/123
  ✓ test parameter path: /books/{cId}/{title} -> /books/123/abc
  ✓ test parameter path: /books/book-{cid}-{uid} -> /books/book-16-a22648042114
  ✓ test cutout parameter path: /{@:user}/article-{cid}-{uid}-{id}-{pid} -> /@jiuhuan/article-16-a22648042114-xxxxx-1
  ✓ test optional parameter path: /books/{cId}{/:title}? -> /books/123/abc (1 ms)
  ✓ test optional parameter path: /books/{cId}{/:title}?/{tag} -> /books/123/abc
  ✓ test w/ suffix path: /{pkg}/download/{filename}.tgz -> /koa/download/koa-2.13.4.tgz (1 ms)
  ✓ test w/ suffix path: /{pkg}/download/{filename}.(tgz|tar.gz) -> /koa/download/koa-2.13.4.tar.gz

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |
 index.js |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        0.279 s, estimated 1 s
Ran all test suites.
```

## License

MIT © [Han Bing](https://github.com/jiuhuan)
