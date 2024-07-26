import domtoimage from 'dom-to-image';

export const imageDownload = (node: HTMLElement, filename: string) => {
  domtoimage
    .toPng(node, { height: node.scrollHeight, width: node.scrollWidth })
    .then((dataUrl: string) => {
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    });
};
