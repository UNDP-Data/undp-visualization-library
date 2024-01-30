export function removeOutliers(data: number[]) {
  // Calculate the mean and standard deviation
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const stdDev = Math.sqrt(
    data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / data.length,
  );

  // Set a threshold for outliers (e.g., 2 standard deviations from the mean)
  const outlierThreshold = 2 * stdDev;

  // Filter out values beyond the threshold
  const filteredData = data.filter(
    val => Math.abs(val - mean) <= outlierThreshold,
  );

  return filteredData;
}
