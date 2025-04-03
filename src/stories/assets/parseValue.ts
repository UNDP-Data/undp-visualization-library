export function parseValue(str?: any, defaultVal?: any) {
  try {
    JSON.parse(str);
    return JSON.parse(str);
  } catch (_e) {
    return defaultVal;
  }
}
