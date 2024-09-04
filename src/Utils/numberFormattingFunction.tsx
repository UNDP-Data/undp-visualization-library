import { checkIfNullOrUndefined } from './checkIfNullOrUndefined';

function formatNumberToReadableString(num: number) {
  // Define suffixes for different scales
  const suffixes = ['', 'K', 'M', 'B', 'T'];

  // Determine which scale to use
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

  // Ensure tier is within the range of suffixes
  if (tier === 0) return num.toString();

  // Calculate the scaled number
  const scaled = num / 10 ** (tier * 3);

  // Round to one decimal place if needed
  const formatted = scaled.toFixed(2).replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1'); // Remove trailing ".0"

  // Append the appropriate suffix
  return formatted + suffixes[tier];
}

export function numberFormattingFunction(
  value: number | undefined,
  prefix?: string,
  suffix?: string,
) {
  if (checkIfNullOrUndefined(value)) return 'NA';
  return `${prefix || ''}${
    Math.abs(value as number) < 1
      ? (value as number).toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
      : formatNumberToReadableString(value as number)
  }${suffix || ''}`;
}
