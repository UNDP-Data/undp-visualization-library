import { format } from 'd3-format';

export function numberFormattingFunction(value: number) {
  return Math.abs(value) < 1 ? value : format('~s')(value).replace('G', 'B');
}
