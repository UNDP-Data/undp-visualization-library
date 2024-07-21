import Papa from 'papaparse';

export async function fetchAndParseCSV(
  dataURL: string,
  delimiter?: string,
  header?: boolean,
) {
  return new Promise((resolve, reject) => {
    Papa.parse(dataURL, {
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        resolve(results.data);
      },
      error(error: any) {
        reject(error);
      },
    });
  });
}
