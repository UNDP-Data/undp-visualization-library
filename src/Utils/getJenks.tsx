import * as ss from 'simple-statistics';
import { format } from 'd3-format';
import uniq from 'lodash.uniq';
import sortBy from 'lodash.sortby';
import { padNumberArray } from './padArray';

export function getJenks(data: number[], noOfSteps: number) {
  const d1 = sortBy(
    data.filter(d => d !== undefined && d !== null),
    d => d,
  );
  const bins =
    uniq(d1).length < noOfSteps
      ? padNumberArray(d1, noOfSteps).slice(1, -1)
      : ss.jenks(d1, noOfSteps).slice(1, -1);
  const valueArray = bins.map(d =>
    d < 1 ? parseFloat(format('.2r')(d)) : parseInt(format('.2r')(d), 10),
  );
  return valueArray;
}
