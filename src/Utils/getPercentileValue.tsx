export function getPercentileValue(data: number[], percentile: number) {
  // Sort the data
  const sortedData = data.slice().sort((a, b) => a - b);

  // Calculate the index for the desired percentile
  const index = Math.ceil((percentile / 100) * sortedData.length) - 1;

  // Return the value at the calculated index
  return sortedData[index];
}
