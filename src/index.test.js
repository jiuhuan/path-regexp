import { parse } from './index.js'

test('test regexp parameter: /(.*)/g', () => {
  const param = /(.*)/g
  expect(parse(param).pattern).toBe(param)
})

test('test wildcards path: {*} -> /books', () => {
  const target = '/books'
  const param = '{*}'
  const result = { wild: target }
  expect(get(parse(param), target)).toEqual(result)
})

test('test wildcards path: /books/{*} -> /books/horror/goosebumps', () => {
  const target = '/books/horror/goosebumps'
  const param = '/books/{*}'
  const result = { wild: 'horror/goosebumps' }
  expect(get(parse(param), target)).toEqual(result)
})

test('test wildcards path: /books/{genre}/{*} -> /books/horror/goosebumps', () => {
  const target = '/books/horror/goosebumps'
  const param = '/books/{genre}/{*}'
  const result = { genre: 'horror', wild: 'goosebumps' }
  expect(get(parse(param), target)).toEqual(result)
})

test('test loose path: /books -> /books/123', () => {
  const target = '/books/123'
  const param = '/books'
  const result = {}
  expect(get(parse(param, true), target)).toEqual(result)
})

test('test loose path: /books/{id} -> /books/123/title', () => {
  const target = '/books/123/title'
  const param = '/books/{id}'
  const result = {
    id: '123',
  }
  expect(get(parse(param, true), target)).toEqual(result)
})

test('test parameter path: /books/{id} -> /books/123', () => {
  const target = '/books/123'
  const param = '/books/{id}'
  const result = { id: '123' }
  expect(get(parse(param), target)).toEqual(result)
})

test('test parameter path: /books/{cId}/{title} -> /books/123/abc', () => {
  const target = '/books/123/abc'
  const param = '/books/{cId}/{title}'
  const result = { cId: '123', title: 'abc' }
  expect(get(parse(param), target)).toEqual(result)
})

test('test parameter path: /books/book-{cid}-{uid} -> /books/book-16-a22648042114', () => {
  const target = '/books/book-16-a22648042114'
  const param = '/books/book-{cid}-{uid}'
  const result = { cid: '16', uid: 'a22648042114' }
  expect(get(parse(param), target)).toEqual(result)
})

test('test cutout parameter path: /{@:user}/article-{cid}-{uid}-{id}-{pid} -> /@jiuhuan/article-16-a22648042114-xxxxx-1', () => {
  const target = '/@jiuhuan/article-16-a22648042114-xxxxx-1'
  const param = '/{@:user}/article-{cid}-{uid}-{id}-{pid}'
  const result = {
    user: 'jiuhuan',
    cid: '16',
    uid: 'a22648042114',
    id: 'xxxxx',
    pid: '1',
  }
  expect(get(parse(param), target)).toEqual(result)
})

test('test optional parameter path: /books/{cId}{/:title}? -> /books/123/abc', () => {
  const target = '/books/123/abc'
  const param = '/books/{cId}{/:title}?'
  const result = { cId: '123', title: 'abc' }
  expect(get(parse(param), target)).toEqual(result)
})

test('test optional parameter path: /books/{cId}{/:title}?/{tag} -> /books/123/abc', () => {
  const target = '/books/123/abc'
  const param = '/books/{cId}{/:title}?/{tag}'
  const result = { cId: '123', title: undefined, tag: 'abc' }
  expect(get(parse(param), target)).toEqual(result)
})

test('test w/ suffix path: /{pkg}/download/{filename}.tgz -> /koa/download/koa-2.13.4.tgz', () => {
  const target = '/koa/download/koa-2.13.4.tgz'
  const param = '/{pkg}/download/{filename}.tgz'
  const result = {
    pkg: 'koa',
    filename: 'koa-2.13.4',
  }
  expect(get(parse(param), target)).toEqual(result)
})

test('test w/ suffix path: /{pkg}/download/{filename}.(tgz|tar.gz) -> /koa/download/koa-2.13.4.tar.gz', () => {
  const target = '/koa/download/koa-2.13.4.tar.gz'
  const param = '/{pkg}/download/{filename}.(tgz|tar.gz)'
  const result = {
    pkg: 'koa',
    filename: 'koa-2.13.4',
  }
  expect(get(parse(param), target)).toEqual(result)
})

function get(re, path) {
  const result = re.pattern.exec(path)
  if (result === null) return null
  result.shift()
  return re.keys.reduce((o, k, i) => {
    o[k] = result[i]
    return o
  }, {})
}
