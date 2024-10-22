import uniqBy from 'lodash.uniqby';
import flattenDeep from 'lodash.flattendeep';
import sortBy from 'lodash.sortby';

export function getUniqValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any,
  column: string,
) {
  if (csvData.length === 0) return [];
  if (typeof csvData[0][column] !== 'object') {
    const uniqValues = sortBy(
      uniqBy(csvData, (d: any) => d[column]),
      (d: any) => d[column],
    ).map((d: any) => d[column]);
    return uniqValues;
  }
  const values = sortBy(
    uniqBy(flattenDeep(csvData.map((d: any) => d[column])), el => el),
    (d: string | number) => d,
  );
  return values;
}
