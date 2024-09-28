import { elementToSVG } from 'dom-to-svg';

export function svgDownload(node: HTMLElement, filename: string) {
  const svgDocument = elementToSVG(node);
  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(svgDocument);
  const blob = new Blob([xmlString], { type: 'application/xml' });
  // Create a link element
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);

  // Set the filename for the downloaded file
  link.download = `${filename}.svg`;

  // Append the link to the document body
  document.body.appendChild(link);

  // Programmatically trigger the click event to start the download
  link.click();

  // Remove the link from the document body
  document.body.removeChild(link);
}
