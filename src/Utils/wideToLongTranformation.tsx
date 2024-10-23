export function wideToLongTransformation(
  data: any,
  keyColumn: string,
  readableHeader: {
    value: string;
    label: string;
  }[],
  debugMode?: boolean,
) {
  const transformedData: any = [];
  data.forEach((row: any) => {
    Object.entries(row).forEach(([key, value]) => {
      if (key !== keyColumn) {
        const obj: any = {
          indicator:
            readableHeader.findIndex(d => d.value === key) !== -1
              ? readableHeader[readableHeader.findIndex(d => d.value === key)]
                  .label
              : key,
          value,
        };
        obj[keyColumn] = row[keyColumn];
        transformedData.push(obj);
      }
    });
  });
  if (debugMode) {
    // eslint-disable-next-line no-console
    console.log(transformedData);
  }
  return transformedData;
}
