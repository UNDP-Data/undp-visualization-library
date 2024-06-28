import { format } from 'd3-format';
import { checkIfNullOrUndefined } from './checkIfNullOrUndefined';

export function numberFormattingFunction(
  value: number,
  prefix: string,
  suffix: string,
) {
  if (checkIfNullOrUndefined(value)) return 'NA';
  return `${prefix}${
    Math.abs(value) < 1 ? value : format('.3s')(value).replace('G', 'B')
  }${suffix}`;
}
