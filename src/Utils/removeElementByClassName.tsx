export function removeElementsByClass(className: string) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode?.removeChild(elements[0]);
  }
}
