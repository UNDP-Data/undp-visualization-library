import domtoimage from 'dom-to-image';

export function imageDownload(node: HTMLElement, filename: string) {
  domtoimage
    .toPng(node, {
      height: node.scrollHeight,
      width: node.scrollWidth,
      filter: el => {
        return !(el as any).classList?.contains('undp-viz-download-button');
      },
      style: {
        margin: 0,
      },
    })
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    });
}
