import { format } from 'd3-format';
import { checkIfNullOrUndefined } from './checkIfNullOrUndefined';

export function numberFormattingFunction(
  value: number | undefined,
  prefix: string,
  suffix: string,
) {
  if (checkIfNullOrUndefined(value)) return 'NA';
  return `${prefix}${
    Math.abs(value as number) < 1 || Math.round(value as number) === value
      ? value
      : format('.3s')(value as number).replace('G', 'B')
  }${suffix}`;
}
