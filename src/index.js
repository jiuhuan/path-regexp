/**
 * Copyright(c) Beijing Xiaoju Technology Co, Ltd.
 * @author: Ango Han <hanbingango@didiglobal.com>
 * @since: 2022-05-19 18:41:15
 */

'use strict'

export const KEY_EXP = /\{(.+?)\}\??/g

export function parse(tpl, loose) {
  if (tpl instanceof RegExp) return { keys: [], pattern: tpl }

  let keys = [],
    offset = 0,
    length = 0,
    pattern = '',
    part = null

  while ((part = KEY_EXP.exec(tpl))) {
    const [metch, key] = part

    length = part.index
    pattern += tpl.slice(offset, length)
    offset = length + metch.length

    if (key === '*') {
      keys.push('wild')
      pattern += '(.*)'
      continue
    }

    let [prefix, suffix] = key.split(':')

    if (!suffix) {
      suffix = prefix
      prefix = ''
    }

    keys.push(suffix)
    pattern +=
      metch.lastIndexOf('?') === -1
        ? prefix + '([^/]+?)'
        : '(?:' + prefix + '([^/]+?))?'
  }
  pattern += tpl.slice(offset, tpl.length)
  pattern = new RegExp('^' + pattern + (loose ? '(?=$|/)' : '/?$'), 'i')

  return { keys, pattern }
}
