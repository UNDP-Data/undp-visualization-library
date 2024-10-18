/* eslint-disable no-console */
import Papa from 'papaparse';
import { ColumnConfigurationDataType } from '../Types';
import { transformColumnsToArray } from './transformData/transformColumnsToArray';

export async function fetchAndParseCSV(
  dataURL: string,
  delimiter?: string,
  header?: boolean,
  columnsToArray?: ColumnConfigurationDataType[],
  debugMode?: boolean,
) {
  return new Promise((resolve, reject) => {
    Papa.parse(dataURL, {
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        if (debugMode) {
          console.log('Data from file:', results.data);
        }
        if (columnsToArray) {
          const transformedData = transformColumnsToArray(
            results.data,
            columnsToArray,
          );
          if (debugMode) {
            console.log(
              'Data after transformation of column to array:',
              transformedData,
            );
          }
          resolve(transformedData);
        } else resolve(results.data);
      },
      error(error: any) {
        reject(error);
      },
    });
  });
}

export async function fetchAndParseCSVFromTextBlob(
  data: string,
  delimiter?: string,
  header?: boolean,
  columnsToArray?: ColumnConfigurationDataType[],
  debugMode?: boolean,
) {
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      skipEmptyLines: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        if (debugMode) {
          console.log('Data from file:', results.data);
        }
        if (columnsToArray) {
          const transformedData = transformColumnsToArray(
            results.data,
            columnsToArray,
          );
          if (debugMode) {
            console.log(
              'Data after transformation of column to array:',
              transformedData,
            );
          }
          resolve(transformedData);
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
  debugMode?: boolean,
) {
  const url = dataURL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    if (debugMode) {
      console.log('Data from file:', json);
    }
    if (columnsToArray) {
      const transformedData = transformColumnsToArray(json, columnsToArray);
      if (debugMode) {
        console.log(
          'Data after transformation of column to array:',
          transformedData,
        );
      }
      return transformedData;
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
  dataTransform?: (_d: any) => any,
  debugMode?: boolean,
) {
  const response = await fetch(requestURL, {
    method,
    headers,
    body: requestBody,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  if (debugMode) {
    console.log('Data from file:', response.json());
  }
  if (dataTransform) {
    const result = dataTransform(response.json());
    if (debugMode) {
      console.log('Data after transformation of column to array:', result);
    }
    return result;
  }
  return response.json();
}
