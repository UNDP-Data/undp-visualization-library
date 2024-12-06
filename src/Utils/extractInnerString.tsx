import { string2HTML } from './string2HTML';

export function extractInnerString(str: string) {
  const regex = /^\{\{\{(.*)\}\}\}$/;
  const match = str.match(regex);
  return match ? string2HTML(match[1]) : null;
}
