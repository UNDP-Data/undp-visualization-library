import { ColumnConfigurationDataType } from '../../Types';

export function transformColumnsToArray(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any,
  columnConfig: ColumnConfigurationDataType[],
) {
  const dataFormatted = csvData.map((el: any) => {
    const temp = { ...el };
    columnConfig.forEach(d => {
      temp[d.column] = temp[d.column]
        ? temp[d.column].split(d.delimiter || ',').map((t: string) => t.trim())
        : [];
    });
    return temp;
  });
  return dataFormatted;
}
