// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkIfNullOrUndefined(value: any) {
  if (value === undefined || value === null) return true;
  return false;
}
