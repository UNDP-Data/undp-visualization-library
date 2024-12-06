export function transformDefaultValue(
  defaultValue?: string | string[],
):
  | { value: string; label: string }
  | { value: string; label: string }[]
  | undefined {
  if (defaultValue === undefined) return undefined;

  if (Array.isArray(defaultValue)) {
    return defaultValue.map(el => ({
      value: el,
      label: el,
    }));
  }

  return {
    value: defaultValue,
    label: defaultValue,
  };
}
