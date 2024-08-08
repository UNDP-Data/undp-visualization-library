import uniqBy from 'lodash.uniqby';
import sum from 'lodash.sum';
import maxBy from 'lodash.maxby';
import minBy from 'lodash.minby';
import flattenDeep from 'lodash.flattendeep';
import { AggregationSettingsDataType } from '../../Types';

export function transformDataForAggregation(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  keyColumn: string,
  aggregationSettings: AggregationSettingsDataType[],
) {
  if (typeof data[0][keyColumn] !== 'object') {
    const uniqValues = uniqBy(data, (d: any) => d[keyColumn]).map(d => {
      const dataObj: any = {};
      dataObj[keyColumn] = d[keyColumn];
      const filteredData = data.filter(
        (j: any) => j[keyColumn] === d[keyColumn],
      );
      dataObj.count = filteredData.length;
      aggregationSettings.forEach(el => {
        dataObj[el.column] =
          el.aggregationMethod === 'average'
            ? sum(filteredData.map((j: any) => j[el.column])) /
              filteredData.length
            : el.aggregationMethod === 'max'
            ? maxBy(filteredData, (j: any) => j[el.column])[el.column]
            : el.aggregationMethod === 'min'
            ? minBy(filteredData, (j: any) => j[el.column])[el.column]
            : sum(filteredData.map((j: any) => j[el.column]));
      });
      return dataObj;
    });
    return uniqValues;
  }
  const values = uniqBy(
    flattenDeep(data.map((d: any) => d[keyColumn])),
    el => el,
  );
  const uniqValues = values.map(d => {
    const dataObj: any = {};
    dataObj[keyColumn] = d;
    const filteredData = data.filter(
      (j: any) => j[keyColumn].indexOf(d) !== -1,
    );
    dataObj.count = filteredData.length;
    aggregationSettings.forEach(el => {
      dataObj[el.column] =
        el.aggregationMethod === 'average'
          ? sum(filteredData.map((j: any) => j[el.column])) /
            filteredData.length
          : el.aggregationMethod === 'max'
          ? maxBy(filteredData, (j: any) => j[el.column])[el.column]
          : el.aggregationMethod === 'min'
          ? minBy(filteredData, (j: any) => j[el.column])[el.column]
          : sum(filteredData.map((j: any) => j[el.column]));
    });
    return dataObj;
  });
  return uniqValues;
}
