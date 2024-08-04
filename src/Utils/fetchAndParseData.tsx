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

export async function fetchAndParseJSON(dataURL: string) {
  const url = dataURL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    return error;
  }
}
