export function getPathFromPoints(pointsArray: number[]) {
  if (pointsArray.length < 4 || pointsArray.length % 2 !== 0) {
    return ''; // Need at least two points (4 numbers) and an even number of coordinates
  }

  let path = `M ${pointsArray[0]} ${pointsArray[1]}`; // Move to the first point
  for (let i = 2; i < pointsArray.length; i += 2) {
    path += ` L ${pointsArray[i]} ${pointsArray[i + 1]}`; // Draw lines to subsequent points
  }
  path += ' Z'; // Close the path

  return path;
}
