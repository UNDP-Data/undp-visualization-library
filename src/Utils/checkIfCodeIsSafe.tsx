export function checkIfCodeIsSafe(code: string) {
  const forbiddenPatterns = [
    /eval\(/,
    /Function\(/,
    /window\./,
    /document\./,
    /while\s*\(/,
    /for\s*\(/,
  ];
  return !forbiddenPatterns.some(pattern => pattern.test(code));
}
