/* eslint-disable @typescript-eslint/no-explicit-any */
export function parseValue(str?: any, defaultVal?: any) {
  try {
    JSON.parse(str);
    return JSON.parse(str);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return defaultVal;
  }
}
