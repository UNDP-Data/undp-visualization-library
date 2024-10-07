import Papa from 'papaparse';
import { checkIfCodeIsSafe } from './checkIfCodeIsSafe';
import { ColumnConfigurationDataType } from '../Types';
import { transformColumnsToArray } from './transformData/transformColumnsToArray';

export async function fetchAndParseCSV(
  dataURL: string,
  delimiter?: string,
  header?: boolean,
  columnsToArray?: ColumnConfigurationDataType[],
) {
  return new Promise((resolve, reject) => {
    Papa.parse(dataURL, {
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        if (columnsToArray) {
          resolve(transformColumnsToArray(results.data, columnsToArray));
        } else resolve(results.data);
      },
      error(error: any) {
        reject(error);
      },
    });
  });
}

export async function fetchAndParseJSON(
  dataURL: string,
  columnsToArray?: ColumnConfigurationDataType[],
) {
  const url = dataURL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    if (columnsToArray) {
      return transformColumnsToArray(json, columnsToArray);
    }
    return json;
  } catch (error) {
    return error;
  }
}

export async function fetchAndTransformDataFromAPI(
  requestURL: string,
  method: 'POST' | 'GET' | 'DELETE' | 'PUT',
  headers?: any,
  requestBody?: any,
  dataTransform?: string,
) {
  const response = await fetch(requestURL, {
    method,
    headers,
    body: requestBody,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  if (dataTransform) {
    if (!checkIfCodeIsSafe(dataTransform)) {
      throw new Error(
        'Unsafe code detected in `dataTransform`. Avoid using `eval`, `Function`, `window`, `document`, `while` or `for` loops in the code.',
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const func = new Function(
        'data',
        `"use strict"; return (${dataTransform})(data);`,
      );
      const result = func(response.json());
      return result;
    }
  }
  return response.json();
}
