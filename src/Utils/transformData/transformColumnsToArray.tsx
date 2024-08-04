import { ColumnConfigurationDataType } from '../../Types';

export async function transformColumnsToArray(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any,
  columnConfig: ColumnConfigurationDataType[],
) {
  const dataFormatted = csvData.map((el: any) => {
    const temp = { ...el };
    columnConfig.forEach(d => {
      temp[d.column] = temp[d.column].split(d.delimiter || ',');
    });
    return temp;
  });
  return dataFormatted;
}
