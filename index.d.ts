// index.d.ts
export const KEY_EXP: RegExp
export function parse(
  tpl: RegExp | string,
  loose?: boolean,
): {
  keys: string[]
  pattern: RegExp
}
