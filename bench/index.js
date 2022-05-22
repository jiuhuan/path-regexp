import bench from 'benchmark'

import { parse } from '../src/index.js'

const { Suite } = bench

new Suite()
  .add('Test regexp', () => parse(/(.*)/g))
  .add('Test wildcards', () => parse('{*}'))
  .add('Test parameter', () => parse('/books/{cId}/{title}'))
  .add('Test cutout parameter', () => parse('/{@:user}/article-{cid}-abc'))
  .add('Test optional parameter', () => parse('/books/{cId}{/:title}?'))
  .add('Test w/ suffix parameter', () =>
    parse('/{pkg}/download/{filename}.tgz'),
  )
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
    console.log('Slowest is ' + this.filter('slowest').map('name'))
  })
  .run()
