import flattenDeep from 'lodash.flattendeep';
import intersection from 'lodash.intersection';
import { DataFilterDataType } from '../../Types';

export function filterData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  filters: DataFilterDataType[],
) {
  if (filters.length === 0) return data;
  const filteredData = data.filter((item: any) =>
    filters.every((filter: any) =>
      filter.values.length > 0
        ? intersection(flattenDeep([item[filter.column]]), filter.values)
            .length > 0
        : true,
    ),
  );
  return filteredData;
}
