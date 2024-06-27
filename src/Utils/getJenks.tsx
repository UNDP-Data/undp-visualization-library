import * as ss from 'simple-statistics';
import { format } from 'd3-format';
import uniq from 'lodash.uniq';
import sortBy from 'lodash.sortby';

const padArray = (arr: number[], noOfSteps: number) => {
  const arrTemp = [...arr];
  while (arrTemp.length < noOfSteps) {
    arrTemp.push(arrTemp[arrTemp.length - 1]);
  }
  return arrTemp;
};
export function getJenks(data: number[], noOfSteps: number) {
  const d1 = sortBy(
    data.filter(d => d !== undefined && d !== null),
    d => d,
  );
  const bins =
    uniq(d1).length < noOfSteps
      ? padArray(d1, noOfSteps).slice(1, -1)
      : ss.jenks(d1, noOfSteps).slice(1, -1);
  const valueArray = bins.map(d =>
    d < 1 ? parseFloat(format('.2r')(d)) : parseInt(format('.2r')(d), 10),
  );
  return valueArray;
}
