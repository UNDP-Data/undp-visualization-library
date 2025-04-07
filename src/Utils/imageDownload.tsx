import html2canvas from 'html2canvas';
/**
 * Downloads an image of a specified HTML element as a PNG file.
 *
 * Uses `html2canvas` to capture the content of the `node` and converts it to a downloadable PNG image.
 * It removes elements with the class `undp-viz-download-button` from the clone to prevent them from appearing in the screenshot.
 *
 * @param node - The HTMLElement to capture and convert into an image.
 * @param filename - The desired filename for the downloaded image (without extension).
 *
 * @example
 * const element = document.getElementById('myElement');
 * imageDownload(element, 'screenshot');
 */

export function imageDownload(node: HTMLElement, filename: string) {
  html2canvas(node, {
    height: node.scrollHeight,
    width: node.scrollWidth,
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    logging: false,
    onclone: (_document, clonedNode) => {
      const elementsToRemove = clonedNode.getElementsByClassName(
        'undp-viz-download-button',
      );
      Array.from(elementsToRemove).forEach(el => el.remove());
      // eslint-disable-next-line no-param-reassign
      clonedNode.style.margin = '0';
    },
  }).then((canvas: HTMLCanvasElement) => {
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  });
}
